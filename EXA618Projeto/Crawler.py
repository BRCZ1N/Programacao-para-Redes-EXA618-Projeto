import requests
from bs4 import BeautifulSoup
from Game import Game

def startCrawler():

    response = request("https://store.steampowered.com/search/?sort_by=Released_DESC&supportedlang=brazilian%2Cenglish&tags=1662&os=win&filter=popularnew&ndl=1")
    gameList = getGameList(response)

def request(url):

    return requests.get(url)

def getGameList(response):
    
    gameList = []
    soup = BeautifulSoup(response.content, "html.parser")

    games = soup.find_all("a", class_="search_result_row")

    for game in games:

        id = game.get("data-ds-appid")
        price = None
        title = game.find("span",class_="title").get_text(strip=True)
        release = game.find("div", class_="search_released").get_text(strip=True)
        originalPrice = game.find("div", class_="discount_original_price")
        finalPrice = game.find("div", class_="discount_final_price")
        
        if originalPrice:
            price = originalPrice.get_text(strip=True)
            finalPrice = finalPrice.get_text(strip=True)
        else:
            price = finalPrice.get_text(strip=True)
            finalPrice = None

        currentGame = Game(id,title,release,price,finalPrice)

        gameList.append(currentGame)
    
    return gameList
        

startCrawler()