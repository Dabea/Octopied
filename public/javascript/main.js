$(function() {

$.ajax('/game/config', {
    type: 'GET'
}).then(function(results) {

//Seting up Main variables
let attackCounter = 1 ;
const collecitonTimeModifer = results.gameConfig.collection_time_modifier;
const expGrothModifier = results.gameConfig.experience_growth_modifier;
const tradeCost ={
    dirt: results.gameConfig.dirt_trade_cost,
    rock: results.gameConfig.rock_trade_cost,
    steel: results.gameConfig.steel_trade_cost,
    worm: results.gameConfig.worm_trade_cost,
    fish: results.gameConfig.fish_trade_cost,
    shark: results.gameConfig.shark_trade_cost
};
const resourceDiffuculityRank ={    dirt: results.gameConfig.dirt_resource_difficulty_rank,
    rock: results.gameConfig.rock_resource_difficulty_rank,
    steel: results.gameConfig.steel_resource_difficulty_rank,
    worm: results.gameConfig.worm_resource_difficulty_rank,
    fish: results.gameConfig.fish_resource_difficulty_rank,
    shark: results.gameConfig.shark_resource_difficulty_rank
};
const resources ={
    points: results.resourcesConfig.food,
    hearts: results.resourcesConfig.hearts,
    babbies: results.resourcesConfig.babies,
    babbiesActive: results.resourcesConfig.babies_active,
    babbiesAvailable: results.resourcesConfig.babies_available,
    babbiesHunger: results.resourcesConfig.babies_hunger,
    babbiesLevel: results.resourcesConfig.babies_level,
    worm: results.resourcesConfig.worms,
    fish: results.resourcesConfig.fish,
    shark: results.resourcesConfig.sharks,
    dirt: results.resourcesConfig.dirt,
    rock: results.resourcesConfig.rocks,
    steel: results.resourcesConfig.steel,
    house: results.resourcesConfig.houses
};
const octoStats = {
    level: results.statisticsConfig.level,
    exp: results.statisticsConfig.experience,
    prestidge: results.statisticsConfig.prestige,
    stage: results.statisticsConfig.stage,
    proficiency :{
        food: results.statisticsConfig.food_proficiency,
        gather: results.statisticsConfig.gather_proficiency,
        attack: results.statisticsConfig.attack_proficiency,
        defense: results.statisticsConfig.defense_proficiency
    },
    abilities: {
        foodFrenzy: results.statisticsConfig.food_frenzy,
        inkSpray: results.statisticsConfig.ink_spray,
        rankUp: results.statisticsConfig.rank_up
    }
};
const collectorStatus ={
    dirt: results.statisticsConfig.dirt_collector_status,
    rock: results.statisticsConfig.rock_collector_status,
    steel: results.statisticsConfig.steel_collector_status,
    worm: results.statisticsConfig.worm_collector_status,
    fish: results.statisticsConfig.fish_collector_status,
    shark: results.statisticsConfig.shark_collector_status
};

const resourseUpgradeList = {
    //rank is defined as level / 3 rounded up
    //for example House level 1 2 3 are all rank 1, Rank 2 would 4 5 and 6
    //when something ranks up it might take a new reouse type to level up
    house:   {
        Rank1: results.gameConfig.house_RUL_rank_one, 
        Rank2: results.gameConfig.house_RUL_rank_two, 
        Rank3: results.gameConfig.house_RUL_rank_three 
    },
    heart:   {
        Rank1: results.gameConfig.heart_RUL_rank_one, 
        Rank2: results.gameConfig.heart_RUL_rank_two, 
        Rank3: results.gameConfig.heart_RUL_rank_three 
    },
    food:    {
        Rank1: results.gameConfig.food_RUL_rank_one, 
        Rank2: results.gameConfig.food_RUL_rank_two, 
        Rank3: results.gameConfig.food_RUL_rank_three 
    },
    attack:  {
        Rank1: results.gameConfig.attack_RUL_rank_one, 
        Rank2: results.gameConfig.attack_RUL_rank_two, 
        Rank3: results.gameConfig.attack_RUL_rank_three 
    },
    defense: {
        Rank1: results.gameConfig.defense_RUL_rank_one, 
        Rank2: results.gameConfig.defense_RUL_rank_two, 
        Rank3: results.gameConfig.defense_RUL_rank_three 
    },
    babby:  {
        Rank1: results.gameConfig.baby_RUL_rank_one, 
        Rank2: results.gameConfig.baby_RUL_rank_two, 
        Rank3: results.gameConfig.baby_RUL_rank_three 
    }
};

function refreshCollectorStatuses() {
    let check;
    for (let key in collectorStatus) {
        check = collectorStatus[key] ? '[x]' : '[]';
        $(`.collect-${key}`).text(check);
        if (check === '[x]') {
            startGivenCollector(key);
        }
    }
};

function refreshDisplay() {
    $('.counter').text(resources.points);
    $('.currnet-level').text(`Level: ${octoStats.level}`);
    $('.current-exp').text(`Exp: ${octoStats.exp}`);
    $('.current-stage').text(octoStats.stage);
    $('.babby-count').text(resources.babbies);
    $('.resource-worm').text(resources.worm);
    $('.resource-fish').text(resources.fish);
    $('.resource-shark').text(resources.shark);
    $('.resource-dirt').text(resources.dirt);
    $('.resource-rock').text(resources.rock);
    $('.resource-steel').text(resources.steel);
    refreshCollectorStatuses();
    $('.heart-level').text(resources.hearts);
    $('.food-level').text(octoStats.proficiency.food);
    $('.attack-level').text(octoStats.proficiency.attack);
    $('.defense-level').text(octoStats.proficiency.defense);
    $('.house-level').text(resources.house);
    $('.babby-level').text(resources.babbiesLevel);
    if(octoStats.level > 9){
        $('.octo').attr('src', '/images/Octopus.gif');
    }
};

refreshDisplay();

function updateDB(alertSave) {
    if (alertSave) {
        alert('Your progress is being saved!');
    };
    $.ajax("/game", {
        type: "PUT",
        data: {
            resources: resources,
            octoStats: octoStats,
            collectorStatus: collectorStatus
        }
    }).then(function() {
        console.log('Your progress has been saved!');
    }).catch(function(err) {
        console.log(`Oh boy, it broke: ${err}`);
    });
};

$('#save-progress').click(function() {
    updateDB(false);
});

setInterval(function() {updateDB(true);}, 180000);

// Could add a generateor to create custom kids and indepent levels ** strech
const babby = {
    number: 3, // resources.babbies,
    active: 0, // resources.babbiesActive,
    available: 3, //resources.babbiesAvailable,
    level: 1, //resources.babbiesLevel,
    // Hunger Every time there is not enouf food to feed your babies hunger increases after X once they hit 10 hunger they die? ** strech Goal **
    hunger: 2, //resources.babbiesHunger,
    createBaby: function() {
        this.number++
        this.available = this.number - this.active;
        $('.babby-count').text(this.number);
    },
    feed: function() {
        resources.points -= ((this.active * 4 ) + (this.available * this.hunger));
        $('.counter').text(resources.points);
        if(resources.points < 0) {
            collectorStatus.worm = false
            collectorStatus.fish = false
            collectorStatus.shark = false
            collectorStatus.dirt = false
            collectorStatus.rock = false
            collectorStatus.steel = false
            refreshDisplay();
        }
    },
    //need to move logic for the collection starting In here
    // currenlty on line 220 with collector state
    startCollecting: function(resource) {
        if( this.available > 0) {
            this.active++;
            this.available--
            collectorStatus[resource] = true;
            // Builds the name of the funcition that needs to be called useing the given resource
            startGivenCollector(resource);
        }else{
            console.error('You do not have enouf Babbies')
        }
       
    },
    stopCollecting: function(resource) {
        if( this.active >= 1 ) {
            this.active--;
            this.available++
            collectorStatus[resource] = false;
        }else{
            console.error('No colectors to Stop')
        }
    }
}

function startGivenCollector(resource) {
    switch(resource) {
        case 'worm':
            collectWorms();
            break;
        case 'fish':
            collectFish();
            break;
        case 'shark':
            collectShark();
            break;
        case 'dirt':
            collectDirt();
            break;
        case 'rock':
            collectRock();
            break;
        case 'steel':
            collectSteel();
            break;    
        default:
            console.log('default');    
    }
}

$(document).on('click','.octo',clickFrenzy);

/**
 * sets up listners for the application  **neeeds Work**
 * 
 * 
 */
function enable() {
   //setup Listners in here
}


/**
 * This function triggers all the events that happen on normal clicks
 * 
 * @method clickFrenzy 
 */
function clickFrenzy() {
    const clickValue = calcualteClickValue();
    resources.points += clickValue;
   gainExperiance();
   levelup();
   $('.counter').text(resources.points);
   // TODO: move to leveup function 
  

}

/**
 * Changes the Octopus to its second form uses set interal to achive this
 * 
 * @method evolve
 */
function evolve() {
    let evolveFlash = 0
    const timer = setInterval(function() {
    if((evolveFlash % 2) === 0) {
        $('.octo').attr('src', '/images/Octopus.gif');
    }else{
        $('.octo').attr('src', '/images/original.gif');
    }
    evolveFlash++;
    if(evolveFlash === 11) {
        clearInterval(timer);
    }
},180);
}


/**
 * This calcuatees the value that is gained by click baised on the current modiers and items
 * that they player currently has
 * 
 * @method calcualteClickValue
 * @returns INTEGER clickValue 
 */
function calcualteClickValue() {
     const proficiency = (octoStats.proficiency.food * .05) + 1;
     const tool =  0//toolA + toolB + toolC;
     const baseCollect = 1;
     const collectValue = baseCollect + tool;
     const clickValue = Math.ceil( ((octoStats.level * collectValue) * proficiency ));

     return clickValue;
}

/**
 *  This will calculate how much exp is gained
 * 
 * @method gainExperiance
 * 
 * still need to refine exp item section
 */
function gainExperiance() {
    //exp items still need to be made
    const expItem = 1.25;
    const gainExperiance = octoStats.prestidge * (expItem) +1;
    octoStats.exp += gainExperiance;
    $('.current-exp').text(`Exp: ${octoStats.exp}`)
}

/**
 * This will level up the charchter baised on exp
 * 
 * @method levelup
 */
function levelup() {
    if(octoStats.exp > octoStats.level * expGrothModifier) {
    //    alert('level up')
        octoStats.level ++;
        octoStats.exp = 0;
        $('.currnet-level').text(`Level:${octoStats.level}`)
        $('.current-exp').text(`Exp: ${octoStats.exp}`)

        if(octoStats.level === 10 && octoStats.exp === 0) {
            alert('Oh Something Happening');
           evolve();
        }
       
    }
}

/**
 * This lets you to spend your points to get upgrade materials
 * 
 * @method buyResource
 * @param {any} itemName 
 * @param {number} [count=1] 
 */
function buyResource(itemName, count = 1) {
    if(resources.points > tradeCost[itemName] * count) {
        //Add resource
        resources[itemName]++;
        //subtract toatl points
        resources.points -= tradeCost[itemName] * count;
        //update Screen
        $('.counter').text(resources.points);
        const selector = '.resource-' + [itemName];
        $(selector).text( resources[itemName])
    }else{
        alert(`you dont have enouf points You Need  ${tradeCost[itemName]}  points`)
    }
}


/**
 * This will let you use resources to use this you need to input the 
 * name of the item and the quanity and it will either spend the points or 
 * it will sent a message letting the user know they do not have the required resources
 * 
 * @method buyItem
 * @param {any} itemName 
 * @param {number} [count=1] 
 * @return {bool}
 */
function buyItem(itemName, count = 1) {
    if(resources[itemName] >=  count) {
        resources[itemName] -= count;
        $(`.${itemName}` ).text( resources[itemName]);
        const selector = '.resource-' + [itemName];
        $(selector).text( resources[itemName])
        return true;
    }else{
        alert(`you dont have enouf ${itemName}s`)
        return false;
    }
}

function buyUpgrade(upgrade) {
   const currentUpgradeLevel =  octoStats.proficiency[upgrade];
   const rank = Math.ceil(currentUpgradeLevel / 10);
   const rankName = 'Rank' + rank
   const requiredResource = resourseUpgradeList[upgrade][rankName];
    const resourceQuanityNeeded = 3 * octoStats.proficiency[upgrade] * rank ;
   if (resourceQuanityNeeded <  resources[requiredResource]) {
    resources[requiredResource] -=resourceQuanityNeeded;
    octoStats.proficiency[upgrade]++;
    refreshDisplay();
   }else{
       alert(`you need ${resourceQuanityNeeded}  ${requiredResource} To buy this Item`)
   }
}


function checkForCollectors() {
    const check = '[]';
    $('.collect-shark').text(check);

}

$('.upgrade-heart').on('click', function() {
    buyUpgrade('heart')
})

$('.upgrade-food').on('click', function() {
    buyUpgrade('food')
})

$('.upgrade-attack').on('click', function() {
    buyUpgrade('attack')
})

$('.upgrade-defense').on('click', function() {
    buyUpgrade('defense')
})

$('.collect-worm').on('click', function() {
    if(babby.number === 0) {
        console.log("You must have a child to collect resources")
        return;
    }
    collectorStatus.worm ? babby.stopCollecting('worm') : babby.startCollecting('worm') ;
    const check = collectorStatus.worm ? '[x]' : '[]';
    $('.collect-worm').text(check);
    
})

$('.collect-fish').on('click', function() {
    if(babby.number === 0) {
        console.log("You must have a child to collect resources")
        return;
    }
    collectorStatus.fish ? babby.stopCollecting('fish') : babby.startCollecting('fish') ;
    const check = collectorStatus.fish ? '[x]' : '[]';
    $('.collect-fish').text(check);
})  

$('.collect-shark').on('click', function() {
    if(babby.number === 0) {
        console.log("You must have a child to collect resources")
        return;
    }
    collectorStatus.shark ? babby.stopCollecting('shark') : babby.startCollecting('shark') ;
    const check = collectorStatus.shark ? '[x]' : '[]';
    $('.collect-shark').text(check);
})  

$('.collect-dirt').on('click', function() {
    if(babby.number === 0) {
        console.log("You must have a child to collect resources")
        return;
    }
    if(resources.points < 0) {
        alert('please collect food')
        return;
    }
    collectorStatus.dirt ? babby.stopCollecting('dirt') : babby.startCollecting('dirt') ;
    const check = collectorStatus.dirt ? '[x]' : '[]';
    $('.collect-dirt').text(check);
}) 

$('.collect-rock').on('click', function() {
    if(babby.number === 0) {
        console.log("You must have a child to collect resources")
        return;
    }
    collectorStatus.rock ? babby.stopCollecting('rock') : babby.startCollecting('rock') ;
    const check = collectorStatus.rock ? '[x]' : '[]';
    $('.collect-rock').text(check);
})

$('.collect-steel').on('click', function() {
    if(babby.number === 0) {
        console.log("You must have a child to collect resources")
        return;
    }
    collectorStatus.steel ? babby.stopCollecting('steel') : babby.startCollecting('steel') ;
    const check = collectorStatus.steel ? '[x]' : '[]';
    $('.collect-steel').text(check);
})

function collectWorms() {
    $('.resource-worm').text(resources.worm);
    if(resources.points > 0 &&collectorStatus.worm) {
        setTimeout(function() {
            if(collectorStatus.worm) {
                resources.worm++;
                collectWorms();
            }
        }, (collecitonTimeModifer * resourceDiffuculityRank.worm));
    }
}

function collectFish() {
    $('.resource-fish').text(resources.fish);
    if(resources.points > 0 &&collectorStatus.fish) {
        setTimeout(function() {
            if(collectorStatus.fish) {
                resources.fish++;
                collectFish();
            }
        }, (collecitonTimeModifer  * resourceDiffuculityRank.fish));
    }
}

function collectShark() {
    $('.resource-shark').text(resources.shark);
    if(resources.points > 0 &&collectorStatus.shark) {
        setTimeout(function() {
            resources.shark++;
            collectShark();
        }, (collecitonTimeModifer  * resourceDiffuculityRank.shark));
    }
}

function collectDirt() {
    $('.resource-dirt').text(resources.dirt);
    if(resources.points > 0 &&collectorStatus.dirt) {
        setTimeout(function() {
            resources.dirt++;
            collectDirt();
        }, (collecitonTimeModifer  * resourceDiffuculityRank.dirt));
    }
}

function collectRock() {
    $('.resource-rock').text(resources.rock);
    if(resources.points > 0 &&collectorStatus.rock) {
        setTimeout(function() {
            resources.rock++;
            collectRock();
        }, (collecitonTimeModifer  * resourceDiffuculityRank.rock));
    }
}

function collectSteel() {
    $('.resource-steel').text(resources.steel);
    if(resources.points > 0 &&collectorStatus.steel) {
        setTimeout(function() {
            resources.steel++;
            collectSteel();
        }, (collecitonTimeModifer  * resourceDiffuculityRank.steel));
    }
}


function collectResource(type) {
    $('.resource-' + type).text(resources[type]);
    if(collectorStatus[type]) {
        setTimeout(function() {
            resources[type]++;
            console.log("resource is added", resources);
            collectResource(type);

        }, (collecitonTimeModifer));
   
    }
}



/**  
 * this is a function that will collect the reouces over time
 * 
 * need to figure a way to toggle this 
 */
// function collectResource(type) {
//     const 
// }

$('.buy-dirt').on('click', function() {
    buyResource('dirt');
});

$('.buy-worm').on('click', function() {
    buyResource('worm');
});

$('.buy-fish').on('click', function() {
    buyResource('fish');
});

$('.buy-shark').on('click', function() {
    buyResource('shark');
});

$('.buy-rock').on('click', function() {
    buyResource('rock');
});

$('.buy-steel').on('click', function() {
    buyResource('steel');
});






$('.have-babby').on('click', function() {
    //set requirments  Must be lv 11 // have home //  cost 10 fish for first
    if(babby.number < resources.house) {
        if(buyItem('worm', 1)) {
            babby.createBaby();
        }
    }else {
        alert('You do not have enogh room in your house')
    }
      
    
   
})




/* Animations that need to be made for the game

* Need Exp Bar

Need animation for click value that is added (something that displays a number and then heads up and fades away)

Need a text animation to display text (for level ups and other events)

** Things that need to be created still

    profeceny level up

    come up with abilites  that have cool downs

    Add babby helpers that gather resouces

    

    **Strech **

    Hp bars for boss Fights



    Clean code Initinative **
        add function to check if you can collect ( saturday)**

        combind battle and click exp functions

        create function to manage resource loops to git rid of repeated functions

    Next Steps
        level up profecnices
        change monster image on new monster 
        Timer for boss battles


*/

function theHunger() {
    babby.feed();
    console.log('The hunger strikes')
    setTimeout(() => {
        theHunger();
    }, 5000);
   
}

/********** The Colseaum ********/

function calculateAttack() {
    const dammage =  ((octoStats.proficiency.attack * 2) + octoStats.level) * ((octoStats.prestidge * .05) + 1);
    console.log(dammage);
     return dammage;
 }
 

let boss = {
    currentHp : 10,
    isBoss: false,
    
    nextStage:function() {
            octoStats.stage++
            $('.current-stage').text(octoStats.stage);
            if(octoStats.stage % 10 === 0) {
                this.currentHp = octoStats.stage * (20 + (octoStats.stage * 2));
                this.isBoss = true;
                $('.boss-hp').text(this.currentHp);
            }else{
                this.currentHp = octoStats.stage * (10 + octoStats.stage);
                this.isBoss = false;
                const randomMonster = 'monster-' + Math.ceil(Math.random()*13)
                const $monster = $('.boss-image');
                $monster.removeClass();
                $monster.addClass( 'boss-image');
                $monster.addClass( randomMonster);
                $('.boss-hp').text(this.currentHp);
            }

        
    },
    // TODO: Clean Up merge two exp functions
    getRewards: function() {
        const expItem = 1.25;
        const gainExperiance = octoStats.prestidge * (expItem) +1;
        const battleExp = this.isBoss ? (octoStats.stage * 2) * (expItem) +1 : ((octoStats.stage * 2) * 2) * (expItem) +1;
        octoStats.exp += gainExperiance + battleExp;
        $('.current-exp').text(`Exp: ${octoStats.exp}`)
        const foodBonus = this.isBoss ? (octoStats.stage * 3) : ((octoStats.stage * 3) * 3);
        resources.points += foodBonus;
        $('.counter').text(resources.points);
        levelup();
    },
    hit: function() {
        this.currentHp -= calculateAttack() -2;
        $('.boss-hp').text(this.currentHp);
        if(this.currentHp < 1 ) {
            boss.getRewards();
            boss.nextStage();
        }
    }
    
}

$('.boss').on('click', function() {
        boss.hit();

})

function whichAnimationEvent(){
    var t,
        el = document.createElement("fakeelement");
  
    var animations = {
      "animation"      : "animationend",
      "OAnimation"     : "oAnimationEnd",
      "MozAnimation"   : "animationend",
      "WebkitAnimation": "webkitAnimationEnd"
    }
  
    for (t in animations){
      if (el.style[t] !== undefined){
        return animations[t];
      }
    }
  }
  
  var animationEvent = whichAnimationEvent();
  
  $(".boss").click(function(){
   $('.boss-image').append(`<div style=" position: absolute" class="slash-${attackCounter}"></div>`)
   if(attackCounter < 5){
       attackCounter++;
   }else{
       attackCounter = 1;
       $('.boss-image').empty();
   }
   console.log(attackCounter);
    $('.slash-1').one(animationEvent,
                function(event) {
     $(this).remove();
    });
  });


theHunger();


}).catch(function(err) {
    console.log(`Oh boy, it broke: ${err}`);
});

});

