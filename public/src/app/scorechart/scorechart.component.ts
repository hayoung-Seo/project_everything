import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {HttpService} from '../http.service';
import * as d3 from 'd3'
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Component({
  selector: 'app-scorechart',
  templateUrl: './scorechart.component.html',
  styleUrls: ['./scorechart.component.css']
})
export class ScorechartComponent implements AfterViewInit {

  @ViewChild('myIdentifier', {static: false}) myIdentifier: ElementRef;
  @Input() team ;
  contentHeight: number;
  contentWidth: number;
  matches: any;
  prev_matches : any;
  users : any;
  teams : any;
  
  constructor(
    private _httpService : HttpService,
    private _route: ActivatedRoute,
    private _router: Router,
    private el:ElementRef
  ) {}

  // ngOnInit() {
  //   console.log("--at scorechars component ts");
  //   this.draw_score_graph();
    
  // }
  ngAfterViewInit() {
    this.contentWidth = this.myIdentifier.nativeElement.offsetWidth;
    this.contentHeight = this.myIdentifier.nativeElement.offsetHeight;
    // console.log("--width: ", this.contentWidth);
    // console.log("--height: ", this.contentHeight);
    this.get_score_and_draw();
    // this.draw_score_graph();
    this.get_users_data_and_draw();
  } 
  get_users_data_and_draw() {
    let obs = this._httpService.get_all_users();
    obs.subscribe(data => {
      if (data['error']) {
        // console.log("--got error while getting all users data",data['error']);
      } else {
        this.users = data['data'];
        this.build_fan_counts();
        // let fans_set = this.build_fan_counts();
        // console.log("-count by team:", fans_set);
        // this.draw_users_graph(fans_set);
      }
    })
  }

  build_fan_counts() {
    let obs = this._httpService.get_teams();
    obs.subscribe(data => {
      if (data['error']) {
        // console.log("--got error while getting all teams data",data['error']);
      } else {
        this.teams = data['data'];
        // console.log("teams :", this.teams);

        // build object with team name as key
        let cnt_by_team = {};
        // for (let team of this.teams) {
        //   // console.log(team);
        //   cnt_by_team[team['team_name']] = 0;
        // }

        // count users by team
        for (let user of this.users) {
          let fav_team = user['favorite_team'];
          if (cnt_by_team.hasOwnProperty(fav_team)) {
            cnt_by_team[fav_team]++;
          } else {
            cnt_by_team[fav_team] = 1;
          }
        }
        console.log("cnt_by_team:", cnt_by_team);

        // console.log("-count by team:", fans_set);
        this.draw_users_graph(cnt_by_team);
        // return (cnt_by_team);
      }
    })
  }

  get_score_and_draw() {
    let obs = this._httpService.get_matches(this.team);
    obs.subscribe(data => {
      if (data['error']) {
        // console.log("--got error while getting match data",this.team);
      } else {
        // console.log("--got matches data:",data);
        this.matches = data['data'];
        this.select_past_matches();
        let score_set = this.build_score_data();
        this.draw_score_graph(score_set);
      }
    })
  }

  select_past_matches() {
    this.prev_matches = [];
    for (let match of this.matches) {
      if (match['finished'] == "True") {
        this.prev_matches.push(match);
      }
    }
  }

  build_score_data() {
    let score_set = [];
    for (let match of this.prev_matches) {
      let model_name = `${match['team_name_abb']} vs. ${match['opp_team_abb']}`;
      let date =  match['match_date'];
      let win = match['score_team'];
      let lose = match['score_opp'];
      score_set.push({model_name:model_name,
                      date : date,
                      win : win,
                      lose : lose      
      })
    }
    return score_set;
  }
  
  draw_score_graph(models) {
    // var d3: any;
  //   var models = [
  //     {
  //         "model_name":"BAR vs. OSA",
  //         "date":"9/24",
  //         "win":2,
  //         "lose":2
  //     },
  //     {
  //         "model_name":"BAR vs. VAL",
  //         "date":"9/24",
  //         "win":5,
  //         "lose":2
  //     },
  //     {
  //         "model_name":"BAR vs. DOR",
  //         "date":"9/24",
  //         "win":0,
  //         "lose":0
  //     },
  //     {
  //         "model_name":"BAR vs. GRA",
  //         "date":"9/24",
  //         "win":0,
  //         "lose":2
  //     },
  //     {
  //         "model_name":"BAR vs. VAL",
  //         "date":"9/24",
  //         "win":2,
  //         "lose":1
  //     },
  // ];
    var container = d3.select('#chart'),
        // width = 520,
        width = this.contentWidth * 0.95,
        // height = 220,
        height = this.contentHeight * 0.95,
        margin = {top:30, right:20, bottom:30, left:50},
        barPadding = 0.2,
        axisTicks = {qty:5, outerSize:0, dataFormat:'%m-%d'};

    var svg = container
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);
    var xScale0 = d3.scaleBand()
                    .range([0, width - margin.left - margin.right])
                    .padding(barPadding)
    
    var xScale1 = d3.scaleBand()

    var yScale = d3.scaleLinear().range([height - margin.top - margin.bottom, 0])

    var xAxis = d3.axisBottom(xScale0).tickSizeOuter(axisTicks.outerSize);
    var yAxis = d3.axisLeft(yScale).ticks(axisTicks.qty).tickSizeOuter(axisTicks.outerSize);

    // mapping the axis with data
    xScale0.domain(models.map(d => d.model_name))
    xScale1.domain(['win', 'lose']).range([0, xScale0.bandwidth()])
    
    var yMax :any;

    for (let data of models) {
      if (yMax == undefined) {
        yMax = data['win'];
      }
      if (yMax > data['lose']) {
        yMax = data['lose']
      }
      if (yMax > data['win']) {
        yMax = data['win']
      }
    }
    // console.log("--check this..", d3.max(models, d=> d.win > d.lose? d.win : d.lose)]);
    
    // yScale.domain([0, d3.max(models, d=> d.win > d.lose? d.win : d.lose)])
    yScale.domain([0, d3.max(models, function(d:any) {
      return parseInt(d.win > d.lose? d.win : d.lose)
    })])
    
    var model_name = svg.selectAll(".model_name")
                        .data(models)
                        .enter()
                        .append("g")
                        .attr("class", "model_name") 
                        // .attr("transform", d => `translate(${xScale0(d.model_name)},0)`)
                        .attr("transform", function(d:any) {return `translate(${xScale0(d.model_name)},0)`})
                        ;
    
    // appending the bars
    model_name.selectAll(".bar.win")
                .data(d => [d])
                .enter()
                .append("rect")
                .text(function(d:any) { return d.model_name})
                .attr("class", "bar win")
                .style("fill", "#0e74da")
                .attr("x", d => xScale1('win'))
                // .attr("y", d => yScale(d.win))
                .attr("y", function(d:any){return yScale(d.win)})
                .attr("font-family" , "sans-serif")
                .attr("font-size" , "20px")
                .attr("fill" , "white")
                .attr("text-anchor", "middle")
                .attr("width", xScale1.bandwidth())
                // .attr("height", d => {
                //     return height - margin.top - margin.bottom - yScale(d.win)
                // })
                .attr("height", function(d:any) {
                  return (height - margin.top - margin.bottom - yScale(d.win))
                })
    model_name.selectAll(".bar.lose")
            .data(d => [d])
            .enter()
            .append("rect")
            .attr("class", "bar lose")
            .style("fill", "#f0402c")
            .attr("x", d => xScale1('lose'))
            // .attr("y", d => yScale(d.lose))
            .attr("y", function(d:any) {return yScale(d.lose)})
            .attr("width", xScale1.bandwidth())
            // .attr("height", d => {
            //     return height - margin.top - margin.bottom - yScale(d.lose)
            // })
            .attr("height", function(d:any) {
              return height - margin.top - margin.bottom - yScale(d.lose)
            })

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
        .call(xAxis);
    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
    // console.log(this.el.nativeElement);
    // console.log('height---' + this.el.nativeElement.offsetHeight);  
    // console.log('width---' + this.el.nativeElement.offsetWidth); 
    
  }

  draw_users_graph(data) {
    var container = d3.select('#user_chart'),
      // width = 520,
      width = this.contentWidth * 0.95,
      // height = 220,
      height = this.contentHeight * 1.2,
      // margin = {top:30, right:20, bottom:30, left:50},
      barPadding = 0.2,
      axisTicks = {qty:5, outerSize:0, dataFormat:'%m-%d'};

    var margin = 20;
    // var margin = Math.abs(this.contentWidth - width)/2;
    var radius = Math.min(width, height) / 2 - margin;

    var svg = container
            .append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    // Create dummy data
    // var data = {a: 9, b: 20, c:30, d:8, e:12, f:3, g:7, h:14, i :90}
    let teams = [];
    // console.log("data: ", data);
    for (let d in data) {
      teams.push(d);
    }
    // console.log("--keys: ", teams);
    // set the color scale
    var color = d3.scaleOrdinal()
      // .domain(["a", "b", "c", "d", "e", "f", "g", "h", "i"])
      .domain(teams)
      .range(d3.schemeDark2);

    // Compute the position of each group on the pie:
    var pie = d3.pie()
      .sort(null) // Do not sort group by size
      .value(function(d:any) {return d.value; })

    
    // console.log("--check this:", d3.entries(data));
    let entry_data = [];
    for (let [key,val] of Object.entries(data)) {
      entry_data.push({'key':key, 'value':val});
    }
    // console.log("entry_data:", entry_data);
    // var data_ready = pie(d3.entries(data))
    var data_ready = pie(entry_data)

    // The arc generator
    var arc :any = d3.arc()
      .innerRadius(radius * 0.5)         // This is the size of the donut hole
      .outerRadius(radius * 0.8)

    // Another arc that won't be drawn. Just for labels positioning
    var outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
      .selectAll('allSlices')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arc)
      // .attr('fill', function(d:any){ return(color(d.data.key)) })
      .attr('fill', function(d:any): any{ return(color(d.data.key)) })
      .attr("stroke", "white")
      .style("stroke-width", "5px")
      .style("opacity", 0.7)

    // Add the polylines between chart and labels:
    svg
      .selectAll('allPolylines')
      .data(data_ready)
      .enter()
      .append('polyline')
        .attr("stroke", "black")
        .style("fill", "none")
        .attr("stroke-width", 1)
        .attr('points', function(d:any): any {
          var posA = arc.centroid(d) // line insertion in the slice
          var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
          var posC = outerArc.centroid(d); // Label position = almost the same as posB
          var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
          posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
          return [posA, posB, posC]
        })

    // Add the polylines between chart and labels:
    svg
      .selectAll('allLabels')
      .data(data_ready)
      .enter()
      .append('text')
        // .text( function(d:any) { console.log(d.data.key) ; return d.data.key } )
        .text( function(d:any) { return d.data.key } )
        .attr('transform', function(d:any) {
            var pos = outerArc.centroid(d);
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
            return 'translate(' + pos + ')';
        })
        .style('text-anchor', function(d:any) {
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            return (midangle < Math.PI ? 'start' : 'end')
        })
  }


}
