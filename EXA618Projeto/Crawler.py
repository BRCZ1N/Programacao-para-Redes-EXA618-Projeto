import requests
from bs4 import BeautifulSoup
from Game import Game
from datetime import date
from concurrent.futures import ThreadPoolExecutor
import re
import pandas as pd

def startCrawler():

    mainUrl = "https://store.steampowered.com/explore/new/"
    response = fetchPage(mainUrl)
    listGames = extractLinksFromHome(response)
    listHTML = getArrayHTMLs (listGames)
    listGameDetailed = setGameDetail(listHTML, listGames)
    exportToCSV(listGameDetailed)

    
def fetchPage(url):

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

def extractLinksFromHome(response):
    
    listGames = []
    soup = BeautifulSoup(response.content, "html.parser")

    tabs_content = soup.find("div", class_="home_tabs_content")

    #tab_content_new_releases = tabs_content.find("div", id="tab_newreleases_content")

    if tabs_content:
        
        games = tabs_content.find_all("a", class_="tab_item")

        for game in games:
        
            appID = game.get("data-ds-appid")
            priceDiv = game.find("div", class_="discount_prices")
            original_div = priceDiv.find("div", class_="discount_original_price")
            final_div = priceDiv.find("div", class_="discount_final_price")
            if final_div and original_div:
                originalPrice = original_div.get_text(strip=True) if original_div else None
                discountPrice = final_div.get_text(strip=True) if final_div else None
                newGame = Game(appID,originalPrice,discountPrice)
                listGames.append(newGame)
           
            #Jogos sem desconto valores normais
            #normal_price_div = soup.find("div", class_="game_purchase_price")
            #originalPrice = normal_price_div.get_text(strip=True) if normal_price_div else None
            #discountPrice = None
    
    return listGames

def getArrayHTMLs (listGames):
    
    with ThreadPoolExecutor(max_workers=5) as executor:
        results = list(
            executor.map(lambda game: fetchPage(game.url), listGames)
        )
        
    return results
    
def setGameDetail(listHTML, listGames):

    for i, response in enumerate(listHTML):

        soup = BeautifulSoup(response.content, "html.parser")

        boxGame = soup.find("div", class_="glance_ctn")

        if boxGame:
            title_tag = soup.find("div", id="appHubAppName")
            if title_tag:
                title = title_tag.get_text(strip=True)
            else: 
                title = None
            release_tag = boxGame.find("div", class_="date")
            if release_tag:
                date_release = release_tag.get_text(strip=True)
            else: 
                date_release = None
            description_tag = boxGame.find("div", class_="game_description_snippet")
            if description_tag:
                description = description_tag.get_text(strip=True)
            else:
                description = None
            review_tag = boxGame.find("meta", itemprop="reviewCount")
            if review_tag:
                totalReviews = review_tag.get("content")
            else:
                totalReviews = None
            developer_tags = boxGame.find_all(
                "a",
                href=re.compile(r'store\.steampowered\.com/(curator/|developer/|search/\?developer=)')
            )
            if developer_tags:
                developer = list(dict.fromkeys(
                tag.get_text(strip=True) for tag in developer_tags
            ))
            else: 
                developer = None
            publisher_tags = boxGame.find_all(
                "a",
                href=re.compile(r'store\.steampowered\.com/(curator/|publisher/|search/\?publisher=)')
            )
            if publisher_tags:
                publisher = list(dict.fromkeys(
                tag.get_text(strip=True) for tag in publisher_tags
            )) 
            else: 
                publisher = "No Publisher"
        
            game = listGames[i]

            game.title = title
            game.date_research = date.today().isoformat()
            game.date_release = date_release
            game.developer = developer
            game.publisher = publisher
            game.description = description
            game.totalReviews = totalReviews

    return listGames
    

def exportToCSV(listGameDetailed):

    df = pd.DataFrame([vars(game) for game in listGameDetailed])
    df = df.drop_duplicates(subset=["id"])
    df.to_csv("games.csv", index=False)

startCrawler()
