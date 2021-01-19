from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time
from selenium.common.exceptions import TimeoutException
from selenium.common.exceptions import NoSuchElementException
from decouple import config
import pymongo
import glob
import os
import shutil
import fnmatch
import re
from datetime import datetime, timedelta
import json

# variable definitions
options = Options()
options.headless = True

# read from .env
URL = 'https://www.loc.gov/rr/european/egwinv/egwa-bn.html';
CHROME_DRIVER = config('CHROME_DRIVER')

driver = webdriver.Chrome(chrome_options=options,
                          executable_path=CHROME_DRIVER)
wait = WebDriverWait(driver, 10)

def updateVolume(volume):
    if (len(volume) == 2):
        vol = '0' + volume
    else:
        vol = volume
    return vol

def getLinks(volume, pages):
    linkArr=[]
    for page in pages:
        if len(page) == 1:
            link = f"https://tile.loc.gov/image-services/iiif/service:mss:pldec:{volume}:000{page}/full/pct:50/0/default.jpg"
        if len(page) == 2:
            link = f"https://tile.loc.gov/image-services/iiif/service:mss:pldec:{volume}:00{page}/full/pct:50/0/default.jpg"
        if len(page) == 3:
            link = f"https://tile.loc.gov/image-services/iiif/service:mss:pldec:{volume}:0{page}/full/pct:50/0/default.jpg"
        if len(page) == 4:
            link = f"https://tile.loc.gov/image-services/iiif/service:mss:pldec:{volume}:{page}/full/pct:50/0/default.jpg"
        linkArr.append(link)
    return linkArr

def getPages(pages):
    pageArr = []
    if "," in pages:
        tmpPageArr = pages.split(",")
        for tmpPage in tmpPageArr:
            if "-" in tmpPage:
                tmpArr = tmpPage.split("-")
                tmpPageArr = list(range(int(tmpArr[0]), int(tmpArr[1])))
                for page in tmpPageArr:
                    pageArr.append(str(page).lstrip())
                pageArr.append(tmpArr[1])
            else:
                pageArr.append(tmpPage)               
    elif "-" in pages:
        tmpArr = pages.split("-")
        tmpPageArr = list(range(int(tmpArr[0]), int(tmpArr[1])))
        for page in tmpPageArr:
            pageArr.append(str(page).lstrip())
        pageArr.append(tmpArr[1].lstrip())
    else:
        pageArr = pages.split()
    return pageArr

def loginLOC():
    try:
        driver.set_page_load_timeout(15)
        driver.get(URL)

    except:
        pass

# Login to website
print('Logging in to Library of Congress ...')
# loginLOC()

htmlPages = [
    'https://www.loc.gov/rr/european/egwinv/egwa-bn.html',
'https://www.loc.gov/rr/european/egwinv/egwbo-bz.html',
'https://www.loc.gov/rr/european/egwinv/egwc.html',
'https://www.loc.gov/rr/european/egwinv/egwd.html',
'https://www.loc.gov/rr/european/egwinv/egwe-g.html',
'https://www.loc.gov/rr/european/egwinv/egwh-j.html',
'https://www.loc.gov/rr/european/egwinv/egwk-kop.html',
'https://www.loc.gov/rr/european/egwinv/egwkor-kw.html',
'https://www.loc.gov/rr/european/egwinv/egwl.html',
'https://www.loc.gov/rr/european/egwinv/egwm.html',
'https://www.loc.gov/rr/european/egwinv/egwn-o.html',
'https://www.loc.gov/rr/european/egwinv/egwp.html',
'https://www.loc.gov/rr/european/egwinv/egwr.html',
'https://www.loc.gov/rr/european/egwinv/egws-sn.html',
'https://www.loc.gov/rr/european/egwinv/egwso-sy.html',
'https://www.loc.gov/rr/european/egwinv/egwsz-u.html',
'https://www.loc.gov/rr/european/egwinv/egww.html',
'https://www.loc.gov/rr/european/egwinv/egwz.html']

ldvp = {}
listLDVP = []

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["loc"]
jobCollection = mydb["declarations"]
dblist = myclient.list_database_names()
print('dropping existing collection ...')
jobCollection.drop()

for page in htmlPages:
    driver.set_page_load_timeout(20)
    driver.get(page)
    time.sleep(5)
    driver.get(page)
    locTable = driver.find_elements_by_xpath("/html/body/table/tbody/tr[1]/td/table[2]/tbody/tr/td/table")
    rows = driver.find_elements_by_xpath("/html/body/table/tbody/tr[1]/td/table[2]/tbody/tr/td/table/tbody/tr")
    cols = driver.find_elements_by_xpath("/html/body/table/tbody/tr[1]/td/table[2]/tbody/tr/td/table/tbody/tr/td")

    for row in rows:
        cols = row.find_elements_by_tag_name('td')
        locationName = ""
        district = ""
        volume = ""
        pages = ""
        if (len(cols) == 5):
            locationName = cols[0].text
            district = cols[1].text
            volume = updateVolume(cols[2].text)
            pages = getPages(cols[3].text)
            links = getLinks(volume, pages)
            combined = locationName + " " + district + " " + volume
            if len(locationName) > 1:
                link = f"https://www.loc.gov/resource/pldec.{volume}/?sp={pages[0]}"
                print(locationName, district, volume, pages, link)
                ldvp = {
                    "location": locationName,
                    "district": district,
                    "volume": volume,
                    "pages": pages,
                    "link": link,
                    "links":links,
                    "combined": combined
                }
                listLDVP.append(ldvp)
        if (len(cols) == 4):
            ldvp_temp = listLDVP[-1]
            location = ldvp_temp.get('location')
            district = cols[0].text
            volume = updateVolume(cols[1].text)
            pages = getPages(cols[2].text)
            links = getLinks(volume, pages)
            combined = location + " " + district + " " + volume
            link = f"https://www.loc.gov/resource/pldec.{volume}/?sp={pages[0]}"
            ldvp = {
                "location": location,
                "district": district,
                "volume": volume,
                "pages": pages,
                "link": link,
                "links":links,
                "combined": combined
            }
            listLDVP.append(ldvp)
        if (len(cols) == 3):
            location = ldvp_temp.get('location')
            district = ldvp_temp.get('district')
            ldvp_temp = listLDVP[-1]
            volume = updateVolume(cols[0].text)
            pages = getPages(cols[1].text)
            links = getLinks(volume, pages)
            link = f"https://www.loc.gov/resource/pldec.{volume}/?sp={pages[0]}"
            combined = location + " " + district + " " + volume
            ldvp = {
                "location": location,
                "district": district,
                "volume": volume,
                "pages": pages,
                "link": link,
                "links":links,
                "combined" : combined
            }
            listLDVP.append(ldvp)
            listLDVP.pop(0)

    for l in listLDVP:
        print("inserting ", l)
        jobCollection.insert_one(l)
    listLDVP = []
    time.sleep(10)

driver.close()
print('done!')
