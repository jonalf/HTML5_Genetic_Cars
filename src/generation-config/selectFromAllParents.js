var getInbreedingCoefficient = require("./inbreeding-coefficient");

//module.exports = simpleSelect;
module.exports = selectFromAllParents;

/*
function simpleSelect(parents){
  var totalParents = parents.length
  var r = Math.random();
  if (r == 0)
    return 0;
  return Math.floor(-Math.log(r) * totalParents) % totalParents;
}
*/

//original roulette wheel selection
function selectFromAllParentsOLD(parents, parentList, previousParentIndex) {
  var previousParent = parents[previousParentIndex];
  var validParents = parents.filter(function(parent, i){
    if(previousParentIndex === i){
      return false;
    }
    if(!previousParent){
      return true;
    }
    var child = {
      id: Math.random().toString(32),
      ancestry: [previousParent, parent].map(function(p){
        return {
          id: p.def.id,
          ancestry: p.def.ancestry
        }
      })
    }
    var iCo = getInbreedingCoefficient(child);
    console.log("inbreeding coefficient", iCo)
    if(iCo > 0.25){
      return false;
    }
    return true;
  })
  if(validParents.length === 0){
    return Math.floor(Math.random() * parents.length)
  }
  var totalScore = validParents.reduce(function(sum, parent){
    return sum + parent.score.v;
  }, 0);
  var r = totalScore * Math.random();
  for(var i = 0; i < validParents.length; i++){
    var score = validParents[i].score.v;
    if(r > score){
      r = r - score;
    } else {
      break;
    }
  }
  return i;
}

//DW tournament selection
function selectFromAllParents(parents, parentList, previousParentIndex) {
  var previousParent = parents[previousParentIndex];
  // var validParents = parents.filter(function(parent, i){
  //   if(previousParentIndex === i){
  //     return false;
  //   }
  //   if(!previousParent){
  //     return true;
  //   }
  //   var child = {
  //     id: Math.random().toString(32),
  //     ancestry: [previousParent, parent].map(function(p){
  //       return {
  //         id: p.def.id,
  //         ancestry: p.def.ancestry
  //       }
  //     })
  //   }
  //   var iCo = getInbreedingCoefficient(child);
  //   console.log("inbreeding coefficient", iCo)
  //   if(iCo > 0.25){
  //     return false;
  //   }
  //   return true;
  // })
  var validParents = parents;
  if(validParents.length === 0){
    return Math.floor(Math.random() * parents.length)
  }

  //pick 2 random parents
  var p0 = Math.floor(Math.random() * validParents.length);
  var p1 = Math.floor(Math.random() * validParents.length);

  //return the one with better v. tournament selection
  if (validParents[p0].score.v > validParents[p1].score.v) {
    return p0;
  }
  else {
    return p1;
  }
}
