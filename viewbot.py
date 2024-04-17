import requests
from http.cookiejar import CookieJar
from torrequest import TorRequest
from random_header_generator import HeaderGenerator
import random
import time

def moreView(count):
    with TorRequest(proxy_port=9050, ctrl_port=9051, password=None) as tor_session:
        views = 1
        for _ in range(count):
            
            tor_session.reset_identity()
            c = CookieJar()
            tor_session.ctrl.signal('CLEARDNSCACHE')
            tor_session.session.cookies.update(c)
            generator = HeaderGenerator()
            headers = generator()
            try:
                post_urls = [
                    "https://x3n064.blogspot.com/2024/04/5.html",
                    "https://x3n064.blogspot.com/2024/04/4th.html",
                    "https://x3n064.blogspot.com/2024/04/3rd.html",
                    "https://x3n064.blogspot.com/2024/04/second-post.html",
                    "https://x3n064.blogspot.com/2024/04/first-post.html",
                    "https://x3n064.blogspot.com/2024/04/what-is-posthumanism.html", 
                    "https://x3n064.blogspot.com/2024/04/bitcoin-2024-prediction.html", 
                    "https://x3n064.blogspot.com/2024/04/crypto-2024-prediction.html", 
                    "https://x3n064.blogspot.com/2024/04/devin-ai-2024-update.html", 
                    "https://x3n064.blogspot.com/2024/04/figure-ai-2024-update.html",  
                    "https://x3n064.blogspot.com/2024/04/tesla-bot-2024-update.html"
                ]

                url = random.choice(post_urls)

                response = tor_session.get(url, headers=headers)
                print("Visited website: ", url)
                print("Views: ", views)

                #sleep_interval = random.randint(1, 65)
                #print(f"Sleeping for {sleep_interval} seconds...")
                #time.sleep(sleep_interval)

                views = views + 1

            except requests.exceptions.RequestException as e:
                print('Connection error:', e)

# Example usage:
count = 1000000 #int(input("Enter the number of iterations: "))
moreView(count)
