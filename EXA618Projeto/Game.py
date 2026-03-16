class Game:
    def __init__(self, id, title, price, discountPrice):
        self.id = id
        self.title = title
        self.date_release = None
        self.price = price
        self.discountPrice = discountPrice
        self.developer = ""
        self.publisher = ""
        self.description = ""
        self.totalReviews = 0
        self.scoreReview = 0
        
    def getURL(self):
        return  f"https://store.steampowered.com/app/"+self.id