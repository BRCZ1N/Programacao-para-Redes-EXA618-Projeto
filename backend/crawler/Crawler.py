import requests
from bs4 import BeautifulSoup
from Game import Game
from datetime import date
from concurrent.futures import ThreadPoolExecutor
import re
import pandas as pd

session = requests.Session()

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
}

cookies = {
    "birthtime": "568022401",
    "mature_content": "1",
    "wants_mature_content": "1"
}


def startCrawler():

    mainUrl = "https://store.steampowered.com/explore/new/"
    response = fetchPage(mainUrl)
    listGames = extractLinksFromHome(response)
    listHTML = getArrayHTMLs (listGames)
    listGameDetailed = setGameDetail(listHTML, listGames)
    exportToCSV(listGameDetailed)

"""
Função de acesso a página HTML 
"""
def fetchPage(url):

    return session.get(url, headers=headers, cookies=cookies)


"""
Função para extração dos links e dos preços da página home, isto é, buscao o jogo que está em promoção salvando logo o identificador para pegar os detalhes e o valor
"""

def extractLinksFromHome(response):
    
    listGames = []
    soup = BeautifulSoup(response.content, "html.parser")

    tabsContent = soup.find("div", class_="home_tabs_content")

    if tabsContent:
        
        games = tabsContent.find_all("a", class_="tab_item")

        for game in games:
        
            appID = game.get("data-ds-appid")
            priceDiv = game.find("div", class_="discount_prices")
            originalDiv = priceDiv.find("div", class_="discount_original_price")
            finalDiv = priceDiv.find("div", class_="discount_final_price")
            if finalDiv and originalDiv:
                originalPrice = originalDiv.get_text(strip=True) if originalDiv else None
                discountPrice = finalDiv.get_text(strip=True) if finalDiv else None
                newGame = Game(appID,originalPrice,discountPrice)
                listGames.append(newGame)
    
    return listGames


"""
Função para extrair os HTMLS de todas as páginas dos jogos encontrados na parte de exploração de lançamentos da Steam
"""
def getArrayHTMLs (listGames):
    
    with ThreadPoolExecutor(max_workers=5) as executor:
        results = list(
            executor.map(lambda game: fetchPage(game.url), listGames)
        )
        
    return results

"""
Função que explora todas as URLs encontradas na página de lançamento dos jogos em promoção e pega os detalhes dos games
"""
def setGameDetail(listHTML, listGames):

    for i, response in enumerate(listHTML):

        soup = BeautifulSoup(response.content, "html.parser")

        boxGame = soup.find("div", class_="glance_ctn")

        if boxGame:
            titleTag = soup.find("div", id="appHubAppName")
            if titleTag:
                title = titleTag.get_text(strip=True)
            else: 
                title = None
            dateRelease = boxGame.find("div", class_="date")
            if dateRelease:
                dateRelease = dateRelease.get_text(strip=True)
            else: 
                dateRelease = None
            descriptionTag = boxGame.find("div", class_="game_description_snippet")
            if descriptionTag:
                description = descriptionTag.get_text(strip=True)
            else:
                description = "Sem descrição"
            reviewTag = boxGame.find("meta", itemprop="reviewCount")
            if reviewTag:
                totalReviews = reviewTag.get("content")
            else:
                totalReviews = 0
            reviewRating = boxGame.find("meta", itemprop="ratingValue")
            if reviewRating:
                reviewRating = reviewRating.get("content")
            else:
                reviewRating = 0
            developerTags = boxGame.find_all(
                "a",
                href=re.compile(r'store\.steampowered\.com/(curator/|developer/|search/\?developer=)')
            )
            if developerTags:
                developer = list(dict.fromkeys(
                tag.get_text(strip=True) for tag in developerTags
            ))
            else: 
                developer = None
            publisherTags = boxGame.find_all(
                "a",
                href=re.compile(r'store\.steampowered\.com/(curator/|publisher/|search/\?publisher=)')
            )
            if publisherTags:
                publisher = list(dict.fromkeys(
                tag.get_text(strip=True) for tag in publisherTags
            )) 
            else: 
                publisher = "Sem distribuidora"
        
            game = listGames[i]

            game.title = title
            game.date_research = date.today().isoformat()
            game.date_release = dateRelease
            game.developer = developer
            game.publisher = publisher
            game.review_rating = reviewRating
            game.description = description
            game.total_reviews = totalReviews

    return listGames
    
"""
Função para exportar toda a lista para o formato CSV
"""
def exportToCSV(listGameDetailed):
    new_df = pd.DataFrame([vars(game) for game in listGameDetailed])

    try:
        existing_df = pd.read_csv("games.csv")
        combined_df = pd.concat([existing_df, new_df])
        combined_df = combined_df.drop_duplicates(subset=["id"])
    except FileNotFoundError:
        combined_df = new_df.drop_duplicates(subset=["id"])

    combined_df.to_csv("games.csv", index=False)

startCrawler()
