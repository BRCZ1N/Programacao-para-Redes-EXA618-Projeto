class Game:
    def __init__(self, id, price, discountPrice):
        self.id = id
        self.title = None
        self.date_release = None
        self.date_research = None
        self.price = price
        self.discountPrice = discountPrice
        self.developer = None
        self.publisher = None
        self.description = None
        self.totalReviews = None
        self.scoreReview = None
        self.url = self.getURL()
        
    def getURL(self):
        return  f"https://store.steampowered.com/app/"+self.id