class Game:
    def __init__(self, id):
        self.id = id
        self.title = None
        self.date_release = None
        self.price = None
        self.discountPrice = None
        self.developer = None
        self.publisher = None
        self.description = None
        self.totalReviews = None
        self.scoreReview = None
        self.url = self.getURL()
        
    def getURL(self):
        return  f"https://store.steampowered.com/app/"+self.id