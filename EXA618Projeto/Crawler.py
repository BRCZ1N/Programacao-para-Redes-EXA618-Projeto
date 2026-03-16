import requests
from bs4 import BeautifulSoup
from Game import Game
from concurrent.futures import ThreadPoolExecutor
import re

def startCrawler():

    response = request("https://store.steampowered.com/explore/new/")
    listGames = setGameList(response)
    listHTML = getArrayHTMLs (listGames)
    listGameDetailed = setGameDetailList(listHTML,listGames)
    
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
        print(f"URL: {game.getURL()}")
    

def request(url):

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
        "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
    }
    cookies = {
        "birthtime": "568022401",  # timestamp UNIX >18 anos
        "mature_content": "1",      # marca como permitido conteúdo adulto
        "wants_mature_content": "1"
    }
    return requests.get(url, headers=headers, cookies=cookies)

def setGameList(response):
    
    gameList = []
    soup = BeautifulSoup(response.content, "html.parser")

    games = soup.find_all("a", class_="tab_item")

    for game in games:

        id = game.get("data-ds-appid")
        price = None
        title = game.find("div",class_="tab_item_name").get_text()
        originalPrice = game.find("div", class_="discount_original_price")
        finalPrice = game.find("div", class_="discount_final_price")
        
        if originalPrice:
            price = originalPrice.get_text(strip=True)
            finalPrice = finalPrice.get_text(strip=True)
        else:
            price = finalPrice.get_text(strip=True)
            finalPrice = None

        currentGame = Game(id,title,price,finalPrice)

        gameList.append(currentGame)
    
    return gameList

def getArrayHTMLs (list):
    
    listHTML = [] 
    
    with ThreadPoolExecutor(max_workers=5) as executor:
        results = list(executor.map(func, iterable))
    
    for i in list:
        
        html = request(i.getURL())
        listHTML.append(html.content)
        
    return listHTML

def getHTMLGameDetail(game):

def setGameDetailList(listHTML, listGames):
    
    for i in range(len(listHTML)):
       
        soup = BeautifulSoup(listHTML[i], "html.parser")
        
        boxGame = soup.find("div", class_="glance_ctn")
        release = boxGame.find("div", class_="date")
        if release:
            listGames[i].date_release = release.get_text()
        description = boxGame.find("div", class_="game_description_snippet")
        if description:
            listGames[i].description = description.get_text(strip=True)
        totalReviews = boxGame.find("meta", itemprop="reviewCount")
        if totalReviews:
            listGames[i].totalReviews = totalReviews.get("content")
        developerDiv = boxGame.find("a", href= re.compile(r'^https://store\.steampowered\.com/search/\?developer='))
        if developerDiv:
            listGames[i].developer = developerDiv.get_text(strip=True)
        publisherDiv = boxGame.find("a", href= re.compile(r'^https://store\.steampowered\.com/search/\?publisher='))
        if publisherDiv:
            listGames[i].publisher = publisherDiv.get_text(strip=True)
        
    return listGames

        

startCrawler()