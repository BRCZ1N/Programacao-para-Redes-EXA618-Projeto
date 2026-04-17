class GameDTO:
    def __init__(self, id, price, discountPrice):
        self.id = id
        self.title = None
        self.date_release = None
        self.date_research = None
        self.price = price
        self.discount_price = discountPrice
        self.developer = None
        self.publisher = None
        self.tags = None
        self.description = None
        self.total_reviews = None
        self.review_rating = None
        self.url = self.getURL()
        self.url_image = None
        
    def getURL(self):
        return  f"https://store.steampowered.com/app/"+self.id