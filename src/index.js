import $ from 'jquery';
import { select, scaleQuantile } from 'd3';

import uStates from '../uStates';

import results2004 from '../data/results_2004.json';
import results2008 from '../data/results_2008.json';
import results2012 from '../data/results_2012.json';


function calcVotes(state){
  const stateResults = [];
  for(const candidate in state){
    stateResults.push({ 
      party: state[candidate].parties[0] || 'Other',
      votes: state[candidate].votes || 0 
    });
  }

  // SUM VOTES
  const TOTAL = stateResults.reduce((a,b) => a + b.votes,0),
        independent = stateResults.filter(item => item.party !== 'Republican' && item.party.slice(0,10) !== 'Democratic')
          .reduce((a,c) => a + c.votes, 0),
        republican = stateResults.filter(item => item.party === 'Republican')[0].votes,
        democrat = stateResults.filter(item => item.party.slice(0,10) === 'Democratic')[0].votes;

  return {
    republican: ((republican / TOTAL) * 100).toFixed(2),
    democrat: ((democrat / TOTAL) * 100).toFixed(2),
    independent: ((independent / TOTAL) * 100).toFixed(2), 
  }
}

function cleanData(data) {
  const states = {};
  for(const state in data) {
    const stateName = state.slice(5,7);
    states[stateName] = {
      results: calcVotes(data[state]),
      year: state.slice(0,4)
    };
  }
  return states;
}

const combinedResults = {
  2004: cleanData(results2004),
  2008: cleanData(results2008),
  2012: cleanData(results2012)
};

const statesList = [];
for(const state in combinedResults[2004]){
  statesList.push(state);
}

const colorScale = scaleQuantile()
  .domain([0,4])
  .range(["#fee391","#fec44f","#fe9929","#ec7014"]);


$(document).ready(() => {

  const statesOptions = statesList.sort().map(item => `<option>${item}</option>`);
  $('#state').append(statesOptions);

  const popupHtml = (n,d) => {
    const okl = n === 'Oklahoma' ? 'n/a' : false;
    return (
      `<h4>${n} - ${d.year}</h4>
      <table>
        <tr>
          <td>3rd Parties</td>
          <td>${okl || d.results.independent + '%'}</td>
        </tr>
        <tr>
          <td>Republican</td>
          <td>${d.results.republican}%</td>
        </tr>
        <tr>
          <td>Democrat</td>
          <td>${d.results.democrat}%</td>
        </tr>
      </table>`
    ) 
  }

  const updateMap = (year) => {
    const statesData = {...combinedResults[year]};
    for(const state in statesData) {
      const ind = statesData[state].results.independent;
      statesData[state].color = state ==='OK' ? '#fff' : colorScale(ind)
    }

    uStates.draw('#statesvg', statesData, popupHtml);
  }

  updateMap(2004);

  // Handle map dropdown
  $('#electionYear').on('change', function (e) {
    updateMap(e.target.value);
  });

  // Handle form submit
  $('form').on('submit', function (e) {
    e.preventDefault();
    $('.debug').removeClass('hidden');
    $('.debug b').append( JSON.stringify( $(this).serializeArray() ));
    event.target.reset();
  });


});
