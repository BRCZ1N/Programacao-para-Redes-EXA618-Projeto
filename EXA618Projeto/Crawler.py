import requests
from bs4 import BeautifulSoup
from Game import Game
from concurrent.futures import ThreadPoolExecutor
import re

def startCrawler():

    mainUrl = "https://store.steampowered.com/explore/new/"
    response = request(mainUrl)
    listGames = getGames(response)
    listHTML = getArrayHTMLs (listGames)
    listGameDetailed = setGameDetailList(listHTML, listGames)
    
    for game in listGameDetailed:
    
        print(f"ID: {game.id}")
        print(f"Title: {game.title}")
        print(f"Release Date: {game.date_release}")
        print(f"Price: {game.price}")
        print(f"Discount Price: {game.discountPrice}")
        print(f"Developer: {game.developer}")
        print(f"Publisher: {game.publisher}")
        print(f"Description: {game.description}")
        print(f"Total Reviews: {game.totalReviews}")
        print(f"Score Review: {game.scoreReview}")
        print(f"URL: {game.url}")
    

def request(url):

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
        "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
    }
    cookies = {
        "birthtime": "568022401",  
        "mature_content": "1",     
        "wants_mature_content": "1"
    }
    return requests.get(url, headers=headers, cookies=cookies)

def getGames(response):
    
    listGames = []
    soup = BeautifulSoup(response.content, "html.parser")

    games = soup.find_all("a", class_="tab_item")

    for game in games:

        listGames.append(Game(game.get("data-ds-appid")))
       
    return listGames

def getArrayHTMLs (listGames):
    
    with ThreadPoolExecutor(max_workers=5) as executor:
        results = list(
            executor.map(lambda game: request(game.url), listGames)
        )
        
    return results
    
def setGameDetailList(listHTML, listGames):

    for i, response in enumerate(listHTML):

        soup = BeautifulSoup(response.content, "html.parser")

        boxGame = soup.find("div", class_="glance_ctn")

        title_tag = soup.find("div", id="appHubAppName")
        title = title_tag.get_text(strip=True) if title_tag else None

        if boxGame:
            release_tag = boxGame.find("div", class_="date")
            date_release = release_tag.get_text(strip=True) if release_tag else None
        else:
            date_release = None

        if boxGame:
            description_tag = boxGame.find("div", class_="game_description_snippet")
            description = description_tag.get_text(strip=True) if description_tag else None
        else:
            description = None

        if boxGame:
            review_tag = boxGame.find("meta", itemprop="reviewCount")
            totalReviews = review_tag.get("content") if review_tag else None
        else:
            totalReviews = None

        if boxGame:
            developer_tags = boxGame.find_all(
                "a",
                href=re.compile(r'store\.steampowered\.com/(developer/|search/\?developer=)')
            )

            developer = list(dict.fromkeys(
                tag.get_text(strip=True) for tag in developer_tags
            )) if developer_tags else None
        else:
            developer = None

        if boxGame:
            publisher_tags = boxGame.find_all(
                "a",
                href=re.compile(r'store\.steampowered\.com/(publisher/|search/\?publisher=)')
            )

            publisher = list(dict.fromkeys(
                tag.get_text(strip=True) for tag in publisher_tags
            )) if publisher_tags else None
        else:
            publisher = None

        priceDiv = soup.find("div", class_="discount_prices")

        if priceDiv:
            original_div = priceDiv.find("div", class_="discount_original_price")
            final_div = priceDiv.find("div", class_="discount_final_price")

            originalPrice = original_div.get_text(strip=True) if original_div else None
            discountPrice = final_div.get_text(strip=True) if final_div else None

        else:
            normal_price_div = soup.find("div", class_="game_purchase_price")
            originalPrice = normal_price_div.get_text(strip=True) if normal_price_div else None
            discountPrice = None

        game = listGames[i]

        game.title = title
        game.date_release = date_release
        game.price = originalPrice
        game.discountPrice = discountPrice
        game.developer = developer
        game.publisher = publisher
        game.description = description
        game.totalReviews = totalReviews

    return listGames

        

startCrawler()
