$(function() {
console.log('start');
$.ajax('/game/config', {
    type: 'GET'
}).then(function(results) {

//Seting up Main variables
let attackCounter = results.gameConfig.attack_counter;
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
    house: results.resourcesConfig.houses,
    feul: results.resourcesConfig.feul,
    thruster: results.resourcesConfig.thrusters,
    shuttleBody: results.resourcesConfig.shuttle_bodies,
    shuttleComputer: results.resourcesConfig.shuttle_computers
};
const rocketPieces = [['feul', 'Feul'], ['thruster', 'Thrusters'], 
['shuttleBody', 'Shuttle Bodies'], ['shuttleComputer', 'Shuttle Computers']];
const octoStats = {
    level: results.statisticsConfig.level,
    exp: results.statisticsConfig.experience,
    prestidge: results.statisticsConfig.prestige,
    stage: results.statisticsConfig.stage,
    hp: results.statisticsConfig.hp,
    proficiency :{
        food: results.statisticsConfig.food_proficiency,
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
const wonOrLost = {
    lostOne: results.statisticsConfig.lost_one,
    lostTwo: results.statisticsConfig.lost_two,
    won: results.statisticsConfig.won
};

if (wonOrLost.lostOne) {
    $('#modal2').modal();
    $('#modal2').modal('open');
    wonOrLost.lostOne = false;
}

if (wonOrLost.lostTwo) {
    $('#modal3').modal();
    $('#modal3').modal('open');
    wonOrLost.lostTwo = false;
}

if (wonOrLost.won) {
    $('#modal4').modal();
    $('#modal4').modal('open');
    wonOrLost.won = false;
}

function initialInstruction() {
    if (resources.points === 0) {
        const toastHTML = 'Click your octopus to collect food.';
        M.toast({html: toastHTML});
    }
    if (octoStats.stage === 1) {
        const toastHTML = 'Click on the monster to attack it!';
        M.toast({html: toastHTML});
    }
    const toastHTML = 'Buy what you need to assemble your rocket to win (and get to your home planet!).';
    M.toast({html: toastHTML});
};

function refreshCollectorStatuses(onLoad) {
    let check;
    for (let key in collectorStatus) {
        check = collectorStatus[key] ? '[x]' : '[]';
        $(`.collect-${key}`).text(check);
        if (check === '[x]') {
            if (onLoad) {
                const toastHTML = `You have a baby collecting ${key}${(key === 'rock' || key === 'shark' || key === 'worm') ? 's' : ''}!`;
                M.toast({html:toastHTML});
            }
            startGivenCollector(key);
        }
    }
};

function refreshHearts() {
    $('.health').empty();
    for (let i = 0; i < resources.hearts; i++) {
        $('.health').append(`<span class="health-${i} health-full"><i class="material-icons small">favorite</i></span>`);
    }
};

function refreshDisplay(onLoad) {
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
    refreshCollectorStatuses(onLoad);
    $('.heart-level').text(resources.hearts);
    $('.food-level').text(octoStats.proficiency.food);
    $('.attack-level').text(octoStats.proficiency.attack);
    $('.defense-level').text(octoStats.proficiency.defense);
    $('.house-level').text(resources.house);
    $('.babby-level').text(resources.babbiesLevel);
    if(octoStats.level > 9){
        $('.octo').attr('src', '/images/Octopus.gif');
    }
    refreshHearts();
};


function updateDB(alertSave, reload) {
    if (alertSave) {
        const toastHTML = 'Your progress is being saved!';
        M.toast({html: toastHTML});
    }
    $.ajax("/game", {
        type: "PUT",
        data: {
            resources: resources,
            octoStats: octoStats,
            collectorStatus: collectorStatus,
            wonOrLost: wonOrLost
        }
    }).then(function() {
        if (alertSave) {
            const toastHTML = 'Your progress has been saved!';
            M.toast({html: toastHTML});
        }
        if (reload === 'reload') {
            location.reload();
        }
    }).catch(function(err) {
        console.log(`Oh boy, it broke: ${err}`);
    });
};

initialInstruction();
refreshDisplay(true);

let rocketPiecesCount = 0;

function configRocketPieceAvailability() {
    let stage = octoStats.stage;
    let pieces = rocketPieces;
    let piece;
    while (stage > 20 && pieces.length > 0) {
        piece = pieces.shift();
        stage -= 20;
        if (resources[piece[0]] === 1) {
            rocketPiecesCount++;
        }
        $('#resources-list').append(`<li>Rocket ${piece[1]}:<span class="resource-${piece[0]}"> ${resources[piece[0]]} </span><button><a class="buy-${piece[0]}"><i class="material-icons">attach_money</i></a></button></li>`);
    }
    return pieces;
};

const rocketPiecesToUnlock = configRocketPieceAvailability();

$('#save-progress').click(function() {
    updateDB(false);
});

$('#restart').click(function() {
    startOver();
});

const autoUpdate = setInterval(function(){updateDB(true);}, 180000);

// Could add a generateor to create custom kids and indepent levels ** strech
const babby = {
    number: resources.babbies,
    active: resources.babbiesActive,
    available: resources.babbiesAvailable,
    level: resources.babbiesLevel,
    // Hunger Every time there is not enouf food to feed your babies hunger increases after X once they hit 10 hunger they die? ** strech Goal **
    hunger: resources.babbiesHunger,
    createBaby: function() {
        this.number++;
        resources.babbies = this.number;
        this.available = this.number - this.active;
        resources.babbiesAvailable = this.available;
        const toastHTML = `Your baby${(resources.babbies === 0) ? ' is' : 's are'} hungry! They will eat your food.`;
        M.toast({html:toastHTML});
        if (this.number === 1) {
            theHunger();
        }
        $('.babby-count').text(this.number);
    },
    feed: function() {
        if ((resources.points - ((this.active * 4 ) + (this.available * this.hunger))) > 0) {
            resources.points -= ((this.active * 4 ) + (this.available * this.hunger));
            $('.counter').text(resources.points);
            if (this.hunger > 0) {
                this.hunger = 0;
                resources.babbiesHunger = this.hunger;
                const toastHTML = 'Your babies have food again! Get them collecting again!';
                M.toast({html: toastHTML});
            }
        } else if (this.hunger === 0) {
            $('.counter').text(0);
            resources.points = 0;
            collectorStatus.worm = false;
            collectorStatus.fish = false;
            collectorStatus.shark = false;
            collectorStatus.dirt = false;
            collectorStatus.rock = false;
            collectorStatus.steel = false;
            refreshDisplay(false);
            this.available = this.active + this.available;
            resources.babbiesAvailable = this.available;
            this.active = 0;
            resources.babbiesActive = this.active;
            this.hunger = 1;
            resources.babbiesHunger = this.hunger;
            const toastHTML = 'You are out of food! Your babies have stopped collecting.';
            M.toast({html: toastHTML});
        } else if (this.hunger > 0) {
            this.hunger++;
            resources.babbiesHunger = this.hunger;
            if (this.hunger % 5 === 0) {
                const toastHTML = `Your babies are hungry!`;
                M.toast({html: toastHTML});
            }
            if (this.hunger % 60 === 0) {
                youLose(1);
            }
        }
    },
    //need to move logic for the collection starting In here
    // currenlty on line 220 with collector state
    startCollecting: function(resource) {
        if( this.available > 0) {
            this.active++;
            resources.babbiesActive = this.active;
            this.available--;
            resources.babbiesAvailable = this.available;
            collectorStatus[resource] = true;
            // Builds the name of the funcition that needs to be called useing the given resource
            startGivenCollector(resource);
        }else{
           const toastHTML =  'You do not have enough babies';
        M.toast({html:toastHTML})
        
        }
       
    },
    stopCollecting: function(resource) {
        if( this.active >= 1 ) {
            this.active--;
            resources.babbiesActive = this.active;
            this.available++;
            resources.babbiesAvailable = this.available;
            collectorStatus[resource] = false;
        }else{
            console.error('No collectors to Stop');
        }
    }
};

if (resources.babbies > 0) {
    const toastHTML = `Your baby${(resources.babbies === 0) ? ' is' : 's are'} hungry! They will eat your food.`;
    M.toast({html:toastHTML});
    theHunger();
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
};


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
};

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
};


/**
 * This calcuatees the value that is gained by click baised on the current modiers and items
 * that they player currently has
 * 
 * @method calcualteClickValue
 * @returns INTEGER clickValue 
 */
function calcualteClickValue() {
    const proficiency = (octoStats.proficiency.food * .05) + 1;
    const tool = 0; //toolA + toolB + toolC
    const baseCollect = 1;
    const collectValue = baseCollect + tool;
    const clickValue = Math.ceil( ((octoStats.level * collectValue) * proficiency));
    return clickValue;
};

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
    const gainExperiance = octoStats.prestidge * (expItem) + 1;
    octoStats.exp += gainExperiance;
    $('.current-exp').text(`Exp: ${octoStats.exp}`);
};

/**
 * This will level up the charchter baised on exp
 * 
 * @method levelup
 */
function levelup() {
    if(octoStats.exp > octoStats.level * expGrothModifier) {
        octoStats.level ++;
        octoStats.exp = 0;
        $('.currnet-level').text(`Level: ${octoStats.level}`);
        $('.current-exp').text(`Exp: ${octoStats.exp}`);
        if(octoStats.level === 10 && octoStats.exp === 0) {
            const toastHTML = 'Octo-Growth!';
            M.toast({html: toastHTML});
            evolve();
        }
    }
};

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
        $(selector).text(resources[itemName]);
    } else {
        const toastHTML = `You don't have enough food! You need ${tradeCost[itemName]} food.`;
        M.toast({html:toastHTML});
    }
};

function buyRocketPiece(piece) {
    if (resources[piece] > 0) {
        const toastHTML = 'You already have that Rocket Piece!';
        M.toast({html:toastHTML});
    } else {
        let canBuy = false;
        if (resources.worm > 10 && resources.fish > 10 && resources.shark > 10 && resources.dirt > 10 && resources.rock > 10 && resources.steel > 10) {
            canBuy = true;
        }
        if (canBuy) {
            resources.worm -= 10;
            resources.fish -= 10;
            resources.shark -= 10;
            resources.dirt -= 10;
            resources.rock -= 10;
            resources.steel -= 10;
            resources[piece]++;
            const selector = '.resource-' + [piece];
            $(selector).text(resources[piece]);
            refreshDisplay(false);
            rocketPiecesCount++;
            if (rocketPiecesCount === 4) {
                youWin();
            }
        } else {
            const toastHTML = 'You must have ten rock, steel, dirt, fish, shark, and worm to buy a Rocket Ship piece!';
            M.toast({html:toastHTML});
        }
    }
};


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

 //?
function buyItem(itemName, count = 1) {
    if(resources[itemName] >=  count) {
        resources[itemName] -= count;
        $(`.${itemName}` ).text( resources[itemName]);
        const selector = '.resource-' + [itemName];
        $(selector).text(resources[itemName]);
        return true;
    } else {
        const toastHTML = `You don't have enough ${itemName}s.`;
        M.toast({html:toastHTML});
        return false;
    }
};

function buyUpgrade(upgrade) {
    let currentUpgradeLevel;
    let rank;
    if (upgrade === 'heart') {
        if (resources.hearts === 3) {
            const toastHTML = `Woops. You can't purchase anymore hearts. Octopi can only sustain three.`;
            M.toast({html:toastHTML});
            return;
        } else {
            currentUpgradeLevel =  resources.hearts;
            rank = resources.hearts; 
        }
    } else if (upgrade === 'babby') {
        currentUpgradeLevel = resources.babbiesLevel;
        rank = Math.ceil(currentUpgradeLevel / 10);
    } else {
        currentUpgradeLevel =  octoStats.proficiency[upgrade];
        rank = Math.ceil(currentUpgradeLevel / 10);
    }
    const rankName = 'Rank' + rank;
    const requiredResource = resourseUpgradeList[upgrade][rankName];
    let resourceQuanityNeeded;
    if (upgrade === 'heart' || upgrade === 'babby') {
        resourceQuanityNeeded = 3 * rank;
    } else {
        resourceQuanityNeeded = 3 * octoStats.proficiency[upgrade] * rank;
    }
    if (resourceQuanityNeeded <= resources[requiredResource]) {
        resources[requiredResource] -= resourceQuanityNeeded;
        if (upgrade === 'heart') {
            resources.hearts++;
            octoStats.hp += 10;
        } else if (upgrade === 'babby') {
            babby.level++;
            resources.babbiesLevel++;
        } else {
            octoStats.proficiency[upgrade]++;
        }
        refreshDisplay(false);
    } else {
       const toastHTML = `You need ${resourceQuanityNeeded} ${requiredResource} to buy this upgrade.`;
       M.toast({html:toastHTML});
    }
};

function buildHouse() {
    const currentHouseLevel = resources.house;
    let rank = Math.ceil(currentHouseLevel / 2);
    if(rank === 0) {rank++};
    const rankName = 'Rank' + rank;
    const resourceQuanityNeeded = 3 * resources.house * rank;
    const requiredResource = resourseUpgradeList.house[rankName];
    console.log(rankName, resourseUpgradeList.house)
    if (resourceQuanityNeeded <=  resources[requiredResource]) {
        resources[requiredResource] -= resourceQuanityNeeded;
        resources.house++;
        const toastHTML = 'House updated.';
        M.toast({html:toastHTML});
        $('.house-level').text(resources.house);
    } else {
        const toastHTML = `You need ${resourceQuanityNeeded} ${requiredResource} to upgrade your house.`;
        M.toast({html:toastHTML});
    }
};

$('.upgrade-heart').on('click', function() {
    buyUpgrade('heart')
});

$('.upgrade-food').on('click', function() {
    buyUpgrade('food')
});

$('.upgrade-attack').on('click', function() {
    buyUpgrade('attack')
});

$('.upgrade-defense').on('click', function() {
    buyUpgrade('defense')
});

$('.upgrade-house').on('click', function() {
    buildHouse();
});

$('.upgrade-babby').on('click', function() {
    buyUpgrade('babby');
});

$('.collect-worm').on('click', function() {
    if (babby.number === 0) {
        const toastHTML = 'You must have babies to collect resources.';
        M.toast({html:toastHTML});
        return;
    }
    collectorStatus.worm ? babby.stopCollecting('worm') : babby.startCollecting('worm');
    const check = collectorStatus.worm ? '[x]' : '[]';
    $('.collect-worm').text(check);
    const toastHTML = 'You now have a baby collecting worms!';
    M.toast({html:toastHTML});    
});

$('.collect-fish').on('click', function() {
    if (babby.number === 0) {
        const toastHTML = 'You must have babies to collect resources.';
        M.toast({html:toastHTML});
        return;
    }
    collectorStatus.fish ? babby.stopCollecting('fish') : babby.startCollecting('fish');
    const check = collectorStatus.fish ? '[x]' : '[]';
    $('.collect-fish').text(check);
    const toastHTML = 'You now have a baby collecting fish!';
    M.toast({html:toastHTML});
});

$('.collect-shark').on('click', function() {
    if (babby.number === 0) {
        const toastHTML = 'You must have babies to collect resources.';
        M.toast({html:toastHTML});
        return;
    }
    collectorStatus.shark ? babby.stopCollecting('shark') : babby.startCollecting('shark');
    const check = collectorStatus.shark ? '[x]' : '[]';
    $('.collect-shark').text(check);
    const toastHTML = 'You now have a baby collecting sharks!';
    M.toast({html:toastHTML});
});  

$('.collect-dirt').on('click', function() {
    if (babby.number === 0) {
        const toastHTML = 'You must have babies to collect resources.';
        M.toast({html:toastHTML});
        return;
    }
    collectorStatus.dirt ? babby.stopCollecting('dirt') : babby.startCollecting('dirt');
    const check = collectorStatus.dirt ? '[x]' : '[]';
    $('.collect-dirt').text(check);
    const toastHTML = 'You now have a baby collecting dirt!';
    M.toast({html:toastHTML});
}); 

$('.collect-rock').on('click', function() {
    if (babby.number === 0) {
        const toastHTML = 'You must have babies to collect resources.';
        M.toast({html:toastHTML});
        return;
    }
    collectorStatus.rock ? babby.stopCollecting('rock') : babby.startCollecting('rock');
    const check = collectorStatus.rock ? '[x]' : '[]';
    $('.collect-rock').text(check);
    const toastHTML = 'You now have a baby collecting rocks!';
    M.toast({html:toastHTML});
});

$('.collect-steel').on('click', function() {
    if (babby.number === 0) {
        const toastHTML = 'You must have babies to collect resources.';
        M.toast({html:toastHTML});
        return;
    }
    collectorStatus.steel ? babby.stopCollecting('steel') : babby.startCollecting('steel');
    const check = collectorStatus.steel ? '[x]' : '[]';
    $('.collect-steel').text(check);
    const toastHTML = 'You now have a baby collecting steel!';
    M.toast({html:toastHTML});
});

let getWorms;

function collectWorms() {
    $('.resource-worm').text(resources.worm);
    if (resources.points > 0 && collectorStatus.worm) {
        getWorms = setTimeout(function() {
            resources.worm += babby.level;
            collectWorms();
        }, (collecitonTimeModifer * resourceDiffuculityRank.worm));
    }
};

let getFish;

function collectFish() {
    $('.resource-fish').text(resources.fish);
    if (resources.points > 0 && collectorStatus.fish) {
        getFish = setTimeout(function() {
            resources.fish += babby.level;
            collectFish();
        }, (collecitonTimeModifer  * resourceDiffuculityRank.fish));
    }
};

let getSharks;

function collectShark() {
    $('.resource-shark').text(resources.shark);
    if (resources.points > 0 && collectorStatus.shark) {
        getSharks = setTimeout(function() {
            resources.shark += babby.level;
            collectShark();
        }, (collecitonTimeModifer  * resourceDiffuculityRank.shark));
    }
};

let getDirt;

function collectDirt() {
    $('.resource-dirt').text(resources.dirt);
    if (resources.points > 0 && collectorStatus.dirt) {
        getDirt = setTimeout(function() {
            resources.dirt += babby.level;
            collectDirt();
        }, (collecitonTimeModifer  * resourceDiffuculityRank.dirt));
    }
};

let getRocks;

function collectRock() {
    $('.resource-rock').text(resources.rock);
    if (resources.points > 0 && collectorStatus.rock) {
        getRocks = setTimeout(function() {
            resources.rock += babby.level;
            collectRock();
        }, (collecitonTimeModifer  * resourceDiffuculityRank.rock));
    }
};

let getSteel;

function collectSteel() {
    $('.resource-steel').text(resources.steel);
    if (resources.points > 0 && collectorStatus.steel) {
        getSteel = setTimeout(function() {
            resources.steel += babby.level;
            collectSteel();
        }, (collecitonTimeModifer  * resourceDiffuculityRank.steel));
    }
};

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

$(document).on('click', '.buy-feul', function() {
    buyRocketPiece('feul');
});

$(document).on('click', '.buy-thruster', function() {
    buyRocketPiece('thruster');
});

$(document).on('click', '.buy-shuttleBody', function() {
    buyRocketPiece('shuttleBody');
});

$(document).on('click', '.buy-shuttleComputer', function() {
    buyRocketPiece('shuttleComputer');
});

$('.have-babby').on('click', function() {
    if (babby.number < resources.house) {
        if (buyItem('worm', 1)) {
            babby.createBaby();
        }
    } else {
        const toastHTML = `You don't have enough room in your house.`;
        M.toast({html: toastHTML});
    } 
});


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
let hungryBabies;

function theHunger() {
    babby.feed();
    // console.log('The hunger strikes');
    hungryBabies = setTimeout(() => {
        theHunger();
    }, 5000);
};

/********** The Colseaum ********/

let firstMonsterAttack = true;
let firstBossAttack = true;

function getAttacked() {
    if (boss.isBoss) {
        if (octoStats.proficiency.defense > 30) {
            octoStats.hp -= 1;
        } else {
            octoStats.hp -= 3;
            if (firstBossAttack) {
                const toastHTML = `You might want to upgrade your defense! Attacks will hurt you less.`;
                M.toast({html:toastHTML});
            }
            firstBossAttack = false;
        }
    } else {
        if (octoStats.proficiency.defense > 10) {
            octoStats.hp -= 0.5;
        } else {
            octoStats.hp -= 1;
            if (firstMonsterAttack) {
                const toastHTML = `You might want to upgrade your defense! Attacks will hurt you less.`;
                M.toast({html:toastHTML});
            }
            firstMonsterAttack = false;
        }
    }
    if (octoStats.hp < 20 && resources.hearts === 3) {
        resources.hearts = 2;
        refreshDisplay(false);
        const toastHTML = `You are taking too much damage! You lost a heart!`;
        M.toast({html:toastHTML});
    }
    if (octoStats.hp < 10 && resources.hearts === 2) {
        resources.hearts = 1;
        refreshDisplay(false);
        let toastHTML = `You are taking too much damage! You lost a heart!`;
        M.toast({html:toastHTML});
        toastHTML = `You may want to purchase more hearts!`;
        M.toast({html:toastHTML});
    }
    if (octoStats.hp < 1) {
        youLose(2);
    }
};

function calculateAttack() {
    const crit = (Math.random() > .11) ? 1 : 2.5;
    const dammage =  ((octoStats.proficiency.attack * 3) + (octoStats.level * 2)) * ((octoStats.prestidge * .1) + 1) * crit;
    if (crit === 2.5) {
        console.log('Critical hit!');
    }
    // console.log(dammage);
    return dammage;
};

function unlockRocketPiece() {
    if (rocketPiecesToUnlock.length > 0) {
        const toastHTML = 'You can now buy a new piece of your Rocket Ship!';
        M.toast({html:toastHTML});
        const piece = rocketPiecesToUnlock.shift();
        $('#resources-list').append(`<li>Rocket ${piece[1]}:<span class="resource-${piece[0]}"> 0 </span><button><a class="buy-${piece[0]}"><i class="material-icons">attach_money</i></a></button></li>`);
    }
};
 
$('.battle-time-div').hide();

const boss = {
    currentHp : 10,
    isBoss: false,
    timer: 30,
    nextStage:function() {
        octoStats.stage++;
        boss.setMonster();
    },
    // TODO: Clean Up merge two exp functions
    getRewards: function() {
        const expItem = 1.25;
        const gainExperiance = octoStats.prestidge * (expItem) + 1;
        const battleExp = this.isBoss ? (octoStats.stage * 5) * (expItem) +1 : ((octoStats.stage * 2) * 2) * (expItem) + 1;
        octoStats.exp += gainExperiance + battleExp;
        $('.current-exp').text(`Exp: ${octoStats.exp}`)
        const foodBonus = this.isBoss ? (octoStats.stage * 10) : ((octoStats.stage * 3) * 3);
        resources.points += foodBonus;
        $('.counter').text(resources.points);
        levelup();
        if (octoStats.stage % 20 === 0) {
            unlockRocketPiece();
        }
        boss.nextStage();
    },
    hit: function() {
        this.currentHp -= calculateAttack() - 2;
        $('.boss-hp').text(this.currentHp);
        if(this.currentHp < 1 ) {
            if (this.isBoss) {
                $('.battle-time-div').hide();
                $('.battle-time').text('');
                this.timer = 31;
            }
            const toastHTML = `You killed the ${(this.isBoss) ? 'boss' : 'monster'}!`;
            M.toast({html:toastHTML});
            boss.getRewards();
        }
    },
    bossCountDown: function() {
        if (this.isBoss) {
            if (this.timer > 0) {
                this.timer --;
                $('.battle-time').text(this.timer);
            } else {
                this.timer = 31;
                $('.battle-time-div').hide();
                $('.battle-time').text('');
                const toastHTML = `The boss beat you! Go back a stage.`;
                M.toast({html:toastHTML});
                octoStats.stage--;
                boss.setMonster();
            }
            if (Math.random() > .5) {
                const toastHTML = `You've been attacked!`;
                M.toast({html:toastHTML});
                getAttacked();
            }
            setTimeout(() => {
                boss.bossCountDown();
            }, 1000);
        }
    },
    monsterCountDown: function() {
        if (!this.isBoss) {
            if (Math.random() < .1) {
                const toastHTML = `You've been attacked!`;
                M.toast({html:toastHTML});
                getAttacked();
            }
            setTimeout(() => {
                boss.monsterCountDown();
            }, 3000);
        }
    },
    setMonster: function(){
        if (octoStats.stage % 10 === 0) {
            $('.current-stage').text('Boss');
            this.currentHp = octoStats.stage * (20 + (octoStats.stage * 2));
            this.isBoss = true;
            const randomMonster = 'monster-' + Math.ceil(Math.random() * 13);
            const $monster = $('.boss-image');
            $monster.removeClass();
            $monster.addClass( 'boss-image');
            $monster.addClass( randomMonster);
            $('.boss-hp').text(this.currentHp);
            $('.battle-time-div').show();
            const toastHTML = `Here comes a boss! The clock is ticking...`;
            M.toast({html:toastHTML});
            boss.bossCountDown();
        } else {
            $('.current-stage').text(octoStats.stage);
            this.currentHp = octoStats.stage * (10 + octoStats.stage);
            this.isBoss = false;
            const randomMonster = 'monster-' + Math.ceil(Math.random()*13)
            const $monster = $('.boss-image');
            $monster.removeClass();
            $monster.addClass( 'boss-image');
            $monster.addClass( randomMonster);
            $('.boss-hp').text(this.currentHp);
            boss.monsterCountDown();
        }
    }
    
};

$('.boss').on('click', function() {
    boss.hit();
});

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
};
  
var animationEvent = whichAnimationEvent();
  
$(".boss").click(function() {
   $('.boss-image').append(`<div style=" position: absolute" class="slash-${attackCounter}"></div>`)
   if(attackCounter < 5){
       attackCounter++;
    } else {
       attackCounter = 1;
      
   }
    $('.slash-1').one(animationEvent,
                function(event) {
        $(this).remove();
    });
    $('.slash-2').one(animationEvent,
        function(event) {
          $(this).remove();
    });
    $('.slash-3').one(animationEvent,
        function(event) {
          $(this).remove();
    });
    $('.slash-4').one(animationEvent,
        function(event) {
          $(this).remove();
    });
    $('.slash-5').one(animationEvent,
        function(event) {
          $(this).remove();
    });
  }); 

  function changeStage(){
     const stageBackground ={
          stage1:'<div class="stage-1"></div> <div class="overlay"></div>',
          stage2: ' <div class="stars"></div><div class="clouds"></div> <div class="twinkling"></div>',
          stage3: '<div class="stars"></div><div class="stars-2"></div> ',
          stage4: '<div class="stars"></div><div class="stars-2"></div><div class="space-clouds"></div> ',
          stage5: '<div class="stars-2"></div><div class="space-clouds"></div> <div class="stars-nebula"</div>'

      }
      $('.backgrounds').empty();

      if (octoStats.stage <=10) {
        $('.backgrounds').append( stageBackground.stage1);
      }
      if (octoStats.stage <= 20 &&  octoStats.stage > 10) {
        $('.backgrounds').append( stageBackground.stage2);
      }    
      if (octoStats.stage <= 30 &&  octoStats.stage > 20)   {
        $('.backgrounds').append( stageBackground.stage3);
      }
      if (octoStats.stage <= 40 &&  octoStats.stage > 30)   {
        $('.backgrounds').append( stageBackground.stage4);
      }
      if (octoStats.stage > 40)   {
        $('.backgrounds').append( stageBackground.stage5);
      }
     
      
          
         
     
           
             
       
        
  }

changeStage();

boss.setMonster();

function youWin() {
    wonOrLost.won = true;
    startOver();
};

function youLose(typeOfLoss) {
    if (typeOfLoss === 1) {
        wonOrLost.lostOne = true;
    } else if (typeOfLoss === 2) {
        wonOrLost.lostTwo = true;
    }
    startOver();
};


function startOver() {
    clearInterval(autoUpdate);
    clearTimeout(hungryBabies);
    clearTimeout(getWorms);
    clearTimeout(getFish);
    clearTimeout(getSharks);
    clearTimeout(getDirt);
    clearTimeout(getRocks);
    clearTimeout(getSteel);
    resources.points = 0;
    resources.hearts = 3;
    resources.babbies = 0;
    resources.babbiesActive = 0;
    resources.babbiesAvailable = 0;
    resources.babbiesHunger = 0;
    resources.babbiesLevel = 1;
    resources.worm = 0;
    resources.fish = 0;
    resources.shark = 0;
    resources.dirt = 0;
    resources.rock = 0;
    resources.steel = 0;
    resources.house = 0;
    resources.feul = 0;
    resources.thruster = 0;
    resources.shuttleBody = 0;
    resources.shuttleComputer = 0;
    octoStats.level = 1;
    octoStats.exp = 0;
    octoStats.prestidge = 0;
    octoStats.stage = 1;
    octoStats.hp = 30;
    octoStats.proficiency.food = 1;
    octoStats.proficiency.attack = 1;
    octoStats.proficiency.defense = 1;
    collectorStatus.dirt = false;
    collectorStatus.rock = false;
    collectorStatus.steel = false;
    collectorStatus.worm = false;
    collectorStatus.fish = false;
    collectorStatus.shark = false;
    updateDB(false, 'reload');
};



}).catch(function(err) {
    console.log(`Oh boy, it broke: ${err}`);
});

});
