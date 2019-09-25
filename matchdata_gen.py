# get data from some website and export it as csv
# TO RUN THIS IN COMMAND LINE : python3 matchdata_gen.py
import requests
import urllib.request
import time
from bs4 import BeautifulSoup
import pandas as pd

teams = ['barcelona','manchester-city','juventus','liverpool','real-madrid', 
         'manchester-united','chelsea', 'arsenal','tottenham-hotspur', 'bayern-munich']
abb_dict = {'barcelona':'BAR',
            'manchester-city':'MCI',
            'juventus': 'JUV',
            'liverpool':'LIV',
            'real-madrid':'RMD',
            'manchester-united':'MAN',
            'chelsea': 'CHE',
            'arsenal' : 'ARS',
            'tottenham-hotspur': 'TOT',
            'bayern-munich': 'BM'
           }

# collect match date, VS/AT,logo img_url, team name, finished or not, (past game: W/L, score), league name 
df_all = pd.DataFrame()

for team in teams :
    url = f'https://www.foxsports.com/soccer/{team}-team-schedule'
    response = requests.get(url)
    
    soup = BeautifulSoup(response.text, 'html.parser')
    rows = soup.findAll("tr", {"class":"wisbb_teamScheduleRow"})

    data_team = []

    for row in rows :
        # match date
        match_date = row.findAll("div", {"class":"wisbb_titleElement"})[0].span.string

        # is game VS or AT?
        vs_or_at = (row.findAll("div", {"class":"wisbb_titleElement"}))[1].span.string

        # opponent team name (in 3 letter)
        opp_team_abb = (row.findAll("div", {"class":"wisbb_fullTeamStacked"}))[0].span.label.string

        # opponent team's img url
        opp_team_img_url = (row.findAll("div", {"class":"wisbb_fullTeamStacked"}))[0].img.attrs['src']


        finished = False
        w_or_l = ''
        # is game finished? (has any result?)
        if (len(row.findAll("span", {"class":"wisbb_result"})) > 0) :
            finished = True
            score_div = row.findAll("span", {"class":"wisbb_result"})[0]
            # win or lose or draw
            if (len(score_div.findAll("span", {"class":"wisbb_winner"})) > 0) :
                w_or_l = 'W'
            elif (len(score_div.findAll("span", {"class":"wisbb_tie"})) > 0) :
                w_or_l = 'D'
            elif (len(score_div.findAll("span", {"class":"wisbb_loser"})) > 0) :
                w_or_l = 'L'

            # score of your team
            score_team = (row.findAll("span", {"class":"wisbb_result"}))[0].findAll("span", {"class":"wisbb_scoreItem"})[0].string
            # score of opponent team
            score_opp = (row.findAll("span", {"class":"wisbb_result"}))[0].findAll("span", {"class":"wisbb_scoreItem"})[1].string
        
        else : # this is a future game
            score_team ="";
            score_opp =""
            
        # league
        league = (row.findAll("span", {"class":"wisbb_main"}))[0].string
        data = {'team_name': team, 'team_name_abb':abb_dict[team], 'match_date':match_date, 'vs_or_at':vs_or_at,
                'opp_team_abb':opp_team_abb,'opp_team_img_url':opp_team_img_url, 'finished':finished, 'w_or_l':w_or_l, 
                'score_team':score_team,'score_opp':score_opp, 'league':league}
        data_team.append(data)
        
    df = pd.DataFrame(data_team)
    # your team name
#     df['team_name'] = team
#     df['team_name_abb'] = abb_dict[team]
   
    df_all = df_all.append(df, ignore_index=True)

# export as csv
df_all.to_csv('data.csv', index=True, index_label='index')

print ("-- Data Export finished. check data.csv file")