import requests
from bs4 import BeautifulSoup

def startCrawler():
    
    url = "https://liquipedia.net/counterstrike/ESL/Pro_League/Season_23/Online_Stage"
    headers = {
        "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8"
    }
    
    contentResponse = request(url, headers)
    filtered = analyzeRequest(contentResponse)
    
    #print(filtered)

def request(url, headers):
    
    return requests.get(url, headers=headers).content

def analyzeRequest(content):

    soup = BeautifulSoup(content, "html.parser")

    tables = soup.find_all('table', class_="wikitable wikitable-bordered wikitable-striped swisstable")
    
    for table in tables:
        table.select("span.data-highlightingclass")
        print(table)
        return
    
            
    

    return tables

startCrawler()