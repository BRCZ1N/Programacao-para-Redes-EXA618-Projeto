import requests
from bs4 import BeautifulSoup
from games.services.models.game import GameDTO
from datetime import date, datetime
from concurrent.futures import ThreadPoolExecutor
import re
import ast
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


def start_crawler():

    #clean_existing_dataset()
    mainUrl = "https://store.steampowered.com/explore/new/"
    response = fetch_page(mainUrl)
    listGamePreview = parse_homepage_games(response)
    listHTML = fetch_game_pages (listGamePreview)
    listGame = build_game_list(listHTML, listGamePreview)
    #exportToCSV(listGameDetailed)
    return listGame

"""
Função de acesso a página HTML 
"""
def fetch_page(url):

    return session.get(url, headers=headers, cookies=cookies)


"""
Função para extração dos links e dos preços da página home, isto é, buscao o jogo que está em promoção salvando logo o identificador para pegar os detalhes e o valor
"""

def parse_homepage_games(response):
    
    listGames = []
    soup = BeautifulSoup(response.content, "html.parser")

    tabsContent = soup.find("div", class_="home_tabs_content")

    if tabsContent:
        
        games = tabsContent.find_all("a", class_="tab_item")

        for game in games:
        
            appID_raw = game.get("data-ds-appid")

            appID = None
            if appID_raw:
                appID = appID_raw.split(",")[0]    
            appID = game.get("data-ds-appid").split(",")[0]
            priceDiv = game.find("div", class_="discount_prices")
            originalDiv = priceDiv.find("div", class_="discount_original_price")
            finalDiv = priceDiv.find("div", class_="discount_final_price")
            if finalDiv and originalDiv:
                originalPrice = originalDiv.get_text(strip=True) if originalDiv else None
                discountPrice = finalDiv.get_text(strip=True) if finalDiv else None
                newGame = GameDTO(appID,originalPrice,discountPrice)
                listGames.append(newGame)
    
    return listGames


"""
Função para extrair os HTMLS de todas as páginas dos jogos encontrados na parte de exploração de lançamentos da Steam
"""
def fetch_game_pages (listGames):
    
    with ThreadPoolExecutor(max_workers=5) as executor:
        results = list(
            executor.map(lambda game: fetch_page(game.url), listGames)
        )
        
    return results

"""
Função que explora todas as URLs encontradas na página de lançamento dos jogos em promoção e pega os detalhes dos games
"""
def build_game_list(listHTML, listGames):

    for i, response in enumerate(listHTML):

        game = listGames[i]
        parser_game_item_html(response,game)
        normalize_game_data(game)

    return listGames

def normalize_game_data(data):

    data.date_release = clean_date(data.date_release)
    data.price = parse_price(data.price)
    data.discount_price = parse_price(data.discount_price)

def parser_game_item_html(response, currentItem):
    
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
            url_image = boxGame.find("img", class_="game_header_image_full")
            if url_image:
                url_image = url_image.get("src")
            else:
                url_image = None
            tags_div = boxGame.find("div", class_="glance_tags")
            tags = []
            if tags_div:
                tags = [
                    tag.get_text(strip=True)
                    for tag in tags_div.find_all("a", class_="app_tag")
                    if tag.get_text(strip=True)
                ]
                
            currentItem.title = title
            currentItem.date_research = date.today().isoformat()
            currentItem.date_release = dateRelease
            currentItem.review_rating = reviewRating
            currentItem.description = description
            currentItem.total_reviews = totalReviews
            currentItem.tag = tags
            currentItem.url_image = url_image
            currentItem.developer = developer
            currentItem.publisher = publisher

def parse_price(value):
    if not value:
        return None

    value = str(value)
    value = re.sub(r"[^\d,]", "", value)
    value = value.replace(".", "").replace(",", ".")

    try:
        return float(value)
    except:
        return None

MONTH_MAP = {
    "jan": "01", "fev": "02", "feb": "02",
    "mar": "03", "abr": "04", "apr": "04",
    "mai": "05", "may": "05",
    "jun": "06",
    "jul": "07",
    "ago": "08", "aug": "08",
    "set": "09", "sep": "09",
    "out": "10", "oct": "10",
    "nov": "11",
    "dez": "12", "dec": "12",
}

def clean_date(value):
    if pd.isna(value):
        return None

    value = str(value).lower().strip()

    # remove pontuação
    value = value.replace(".", "")

    # ISO direto
    try:
        return datetime.strptime(value, "%Y-%m-%d").date()
    except:
        pass

    match = re.match(r"(\d{1,2})[ /-]([a-z]{3})[ /-](\d{4})", value)
    if match:
        day, month, year = match.groups()
        month_num = MONTH_MAP.get(month)

        if month_num:
            try:
                return datetime.strptime(f"{year}-{month_num}-{day.zfill(2)}", "%Y-%m-%d").date()
            except:
                return None

    return None
    
"""
Função para exportar toda a lista para o formato CSV
"""

def clean_existing_dataset():
    try:
        df = pd.read_csv("games.csv")
    except FileNotFoundError:
        return

    # schema fixo
    columns = [
        "id", "title", "date_release", "date_research",
        "price", "discount_price", "developer", "publisher",
        "description", "total_reviews", "review_rating", "url"
    ]

    for col in columns:
        if col not in df.columns:
            df[col] = None

    # limpeza FORTE (corrige dataset antigo contaminado)
    df["price"] = df["price"].apply(parse_price)
    df["discount_price"] = df["discount_price"].apply(parse_price)

    df["developer"] = df["developer"].apply(parse_list)
    df["publisher"] = df["publisher"].apply(parse_list)

    df["date_release"] = df["date_release"].apply(clean_date)

    # garante tipos consistentes
    df["total_reviews"] = pd.to_numeric(df["total_reviews"], errors="coerce")
    df["review_rating"] = pd.to_numeric(df["review_rating"], errors="coerce")

    df = df.drop_duplicates(subset=["id"])

    df.to_csv("games.csv", index=False)
    
def exportToCSV(listGameDetailed):
    new_df = pd.DataFrame([vars(game) for game in listGameDetailed])

    try:
        existing_df = pd.read_csv("games.csv")
        df = pd.concat([existing_df, new_df], ignore_index=True)
    except FileNotFoundError:
        df = new_df

    # garante schema fixo (só estrutural, não limpeza)
    columns = [
        "id", "title", "date_release", "date_research",
        "price", "discount_price", "developer", "publisher",
        "description", "total_reviews", "review_rating", "url"
    ]

    for col in columns:
        if col not in df.columns:
            df[col] = None

    df = df.drop_duplicates(subset=["id"])

    df.to_csv("games.csv", index=False)
