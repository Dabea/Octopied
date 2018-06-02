$(function(){

$.ajax('/game/config', {
    type: 'GET'
}).then(function(results){

//Seting up Main variables
let count = 0;
let points = 0;
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
const resourceDiffuculityRank ={
    dirt: results.gameConfig.dirt_resource_difficulty_rank,
    rock: results.gameConfig.rock_resource_difficulty_rank,
    steel: results.gameConfig.steel_resource_difficulty_rank,
    worm: results.gameConfig.worm_resource_difficulty_rank,
    fish: results.gameConfig.fish_resource_difficulty_rank,
    shark: results.gameConfig.shark_resource_difficulty_rank
};
const resources ={
    hearts: results.resourcesConfig.hearts,
    babbies: results.resourcesConfig.babies,
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
    house:   {Rank1: "dirt" , Rank2: "rock", Rank3: "steel" },
    heart:   {Rank1: "worm" , Rank2: "fish", Rank3: "shark" },
    food:    {Rank1: "dirt" , Rank2: "rock", Rank3: "steel" },
    attack:  {Rank1: "rock" , Rank2: "steel", Rank3: "steel" },
    defense: {Rank1: "dirt" , Rank2: "rock", Rank3: "steel" },
    babby:  {Rank1: "worm" , Rank2: "fish", Rank3: "shark" }
}

// Could add a generateor to create custom kids and indepent levels ** strech
const babby = {
    number: 3,
    active: 0,
    available: 3,
    level: 1,
    // Hunger Every time there is not enouf food to feed your babies hunger increases after X once they hit 10 hunger they die? ** strech Goal **
    hunger:2,
    createBaby: function() {
        this.number++
        this.available = this.number - this.active;
        $('.babby-count').text(this.number);
    },
    feed: function() {
        points -= ((this.active * 5  * this.hunger) + (this.available * this.hunger));
        $('.counter').text(points);
        if(points < 0) {
            collectorStatus.dirt = false
        }
    },
    //need to move logic for the collection starting In here
    // currenlty on line 220 with collector state
    startCollecting: function(resource) {
        if( this.available > 0){
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
        if( this.active >= 1 ){
            this.active--;
            this.available++
            collectorStatus[resource] = false;
        }else{
            console.error('No colectors to Stop')
        }
    }
}


function startGivenCollector(resource){
    switch(resource){
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
    points += clickValue;
   gainExperiance();
   levelup();
   $('.counter').text(points);
   // TODO: move to leveup function 
   if(octoStats.level === 10 && octoStats.exp === 0){
       alert('Oh Something Happening');
      evolve();
   }

}

/**
 * Changes the Octopus to its second form uses set interal to achive this
 * 
 * @method evolve
 */
function evolve() {
    let evolveFlash = 0
    const timer = setInterval(function(){
    if((evolveFlash % 2) === 0){
        $('.octo').attr('src', '/images/Octopus.gif');
    }else{
        $('.octo').attr('src', '/images/original.gif');
    }
    evolveFlash++;
    if(evolveFlash === 11){
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
function calcualteClickValue(){
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
function levelup(){
    if(octoStats.exp > octoStats.level * expGrothModifier){
       alert('level up')
        octoStats.level ++;
        octoStats.exp = 0;
        $('.currnet-level').text(`Level:${octoStats.level}`)
        $('.current-exp').text(`Exp: ${octoStats.exp}`);
       
    }
}

/**
 * This lets you to spend your points to get upgrade materials
 * 
 * @method buyResource
 * @param {any} itemName 
 * @param {number} [count=1] 
 */
function buyResource(itemName, count = 1){
    if(points > tradeCost[itemName] * count){
        //Add resource
        resources[itemName]++;
        //subtract toatl points
        points -= tradeCost[itemName] * count;
        //update Screen
        $('.counter').text(points);
        const selector = '.resource-' + [itemName];
        $(selector).text( resources[itemName])
    }else{
        alert('you dont have enouf points')
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
function buyItem(itemName, count = 1){
    if(resources[itemName] >=  count){
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


function checkForCollectors(){
    const check = '[]';
    $('.collect-shark').text(check);

}

$('.collect-worm').on('click', function(){
    if(babby.number === 0){
        console.log("You must have a child to collect resources")
        return;
    }
    collectorStatus.worm ? babby.stopCollecting('worm') : babby.startCollecting('worm') ;
    const check = collectorStatus.worm ? '[x]' : '[]';
    $('.collect-worm').text(check);
    
})

$('.collect-fish').on('click', function(){
    if(babby.number === 0){
        console.log("You must have a child to collect resources")
        return;
    }
    collectorStatus.fish ? babby.stopCollecting('fish') : babby.startCollecting('fish') ;
    const check = collectorStatus.fish ? '[x]' : '[]';
    $('.collect-fish').text(check);
})  

$('.collect-shark').on('click', function(){
    if(babby.number === 0){
        console.log("You must have a child to collect resources")
        return;
    }
    collectorStatus.shark ? babby.stopCollecting('shark') : babby.startCollecting('shark') ;
    const check = collectorStatus.shark ? '[x]' : '[]';
    $('.collect-shark').text(check);
})  

$('.collect-dirt').on('click', function(){
    if(babby.number === 0){
        console.log("You must have a child to collect resources")
        return;
    }
    if(points < 0){
        alert('please collect food')
        return;
    }
    collectorStatus.dirt ? babby.stopCollecting('dirt') : babby.startCollecting('dirt') ;
    const check = collectorStatus.dirt ? '[x]' : '[]';
    $('.collect-dirt').text(check);
}) 

$('.collect-rock').on('click', function(){
    if(babby.number === 0){
        console.log("You must have a child to collect resources")
        return;
    }
    collectorStatus.rock ? babby.stopCollecting('rock') : babby.startCollecting('rock') ;
    const check = collectorStatus.rock ? '[x]' : '[]';
    $('.collect-rock').text(check);
})

$('.collect-steel').on('click', function(){
    if(babby.number === 0){
        console.log("You must have a child to collect resources")
        return;
    }
    collectorStatus.steel ? babby.stopCollecting('steel') : babby.startCollecting('steel') ;
    const check = collectorStatus.steel ? '[x]' : '[]';
    $('.collect-steel').text(check);
})

function collectWorms() {
    $('.resource-worm').text(resources.worm);
    if(points > 0 &&collectorStatus.worm){
        setTimeout(function(){
            if(collectorStatus.worm){
                resources.worm++;
                collectWorms();
            }
        }, (collecitonTimeModifer * resourceDiffuculityRank.worm));
    }
}

function collectFish() {
    $('.resource-fish').text(resources.fish);
    if(points > 0 &&collectorStatus.fish){
        setTimeout(function(){
            if(collectorStatus.fish){
                resources.fish++;
                collectFish();
            }
        }, (collecitonTimeModifer  * resourceDiffuculityRank.fish));
    }
}

function collectShark() {
    $('.resource-shark').text(resources.shark);
    if(points > 0 &&collectorStatus.shark){
        setTimeout(function(){
            resources.shark++;
            collectShark();
        }, (collecitonTimeModifer  * resourceDiffuculityRank.shark));
    }
}

function collectDirt() {
    $('.resource-dirt').text(resources.dirt);
    if(points > 0 &&collectorStatus.dirt){
        setTimeout(function(){
            resources.dirt++;
            collectDirt();
        }, (collecitonTimeModifer  * resourceDiffuculityRank.dirt));
    }
}

function collectRock() {
    $('.resource-rock').text(resources.rock);
    if(points > 0 &&collectorStatus.rock){
        setTimeout(function(){
            resources.rock++;
            collectRock();
        }, (collecitonTimeModifer  * resourceDiffuculityRank.rock));
    }
}

function collectSteel() {
    $('.resource-steel').text(resources.steel);
    if(points > 0 &&collectorStatus.steel){
        setTimeout(function(){
            resources.steel++;
            collectSteel();
        }, (collecitonTimeModifer  * resourceDiffuculityRank.steel));
    }
}


function collectResource(type) {
    $('.resource-' + type).text(resources[type]);
    if(collectorStatus[type]){
        setTimeout(function(){
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

$('.buy-dirt').on('click', function(){
    buyResource('dirt');
});

$('.buy-worm').on('click', function(){
    buyResource('worm');
});

$('.buy-fish').on('click', function(){
    buyResource('fish');
});

$('.buy-shark').on('click', function(){
    buyResource('shark');
});

$('.buy-rock').on('click', function(){
    buyResource('rock');
});

$('.buy-steel').on('click', function(){
    buyResource('steel');
});






$('.have-babby').on('click', function() {
    //set requirments  Must be lv 11 // have home //  cost 10 fish for first
    if(babby.number < resources.house){
        if(buyItem('worm', 1)){
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

*/

function theHunger(){
    babby.feed();
    console.log('The hunger strikes')
    setTimeout(() => {
        theHunger();
    }, 5000);
   
}

/********** The Colseaum ********/

function calculateAttack(){
    const dammage =  ((octoStats.proficiency.attack * 2) + octoStats.level) * ((octoStats.prestidge * .05) + 1);
    console.log(dammage);
     return dammage;
 }
 

let stage = 1;
let boss = {
    currentHp : 10,
    isBoss: false,
    nextStage:function(){
            stage++
            if(stage % 10 === 0){
                this.currentHp = stage * (20 + (stage * 2));
                this.isBoss = true;
                $('.boss-hp').text(this.currentHp);
            }else{
                this.currentHp = stage * (10 + stage);
                this.isBoss = false;
                $('.boss-hp').text(this.currentHp);
            }

        
    },
    // TODO: Clean Up merge two exp functions
    getRewards: function() {
        const expItem = 1.25;
        const gainExperiance = octoStats.prestidge * (expItem) +1;
        const battleExp = this.isBoss ? (stage * 2) * (expItem) +1 : ((stage * 2) * 2) * (expItem) +1;
        octoStats.exp += gainExperiance + battleExp;
        $('.current-exp').text(`Exp: ${octoStats.exp}`)
        const foodBonus = this.isBoss ? (stage * 3) : ((stage * 3) * 3);
        points += foodBonus;
        $('.counter').text(points);
        levelup();
    },
    hit: function(){
        this.currentHp -= calculateAttack() -2;
        $('.boss-hp').text(this.currentHp);
        if(this.currentHp < 1 ){
            boss.getRewards();
            boss.nextStage();
        }
    }
    
}

$('.boss').on('click', function(){
        boss.hit();
})



theHunger();

}).catch(function(err){
    console.log(`Oh boy, it broke: ${err}`);
});

});

