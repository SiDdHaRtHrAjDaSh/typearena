let cd = 0;
let cc = 0;
let tmr = 0;
let wrd = 0;
let wpm = 140;  //little high value to get right speed of meter
let word_ptr = 1;
let lst_ptr = 0;
let err = 0;
let charTyped;
let started = false;
let ended = false;
let err_ack = false;
let accuracy = 0;
let data = `In an interview on-stage at a conference in Utah on Friday, the Facebook CEO said he wouldn't launch a new company in the San Francisco Bay Area, long the tech capital of the United States - home to titans like Apple, Google, and Facebook itself.`;
let lst = data.trim().split(' ');
let text_len = data.trim().length;
let limit = lst.length - 1;
let r1,r2, r3, r4, r5;

lst.forEach((item, index) =>{
    if(index != lst.length -1)
          lst[index] = item+' ';
});

$('document').ready(()=>{
    r1 = new Progress(1, {'name':'Jeff Bezos', 'id': 0});
    r2 = new Progress(2, {'name':'Bill Gates', 'id': 0});
    r3 = new Progress(3, {'name':'Mark Zuckerberg', 'id': 0});
    r4 = new Progress(4, {'name':'Larry Page', 'id': 0});
    r5 = new Progress(5, {'name':'Satya Nadella', 'id': 0});

    initializeText(data);
    start();




});


function error(){
    err++;
}

function timer(){
    if(started){       
        setTimeout(()=>{
            tmr += 1;                
            wpm = Math.round(cc*12/tmr);
            accuracy = ((cd - err)*100/cd).toFixed(2);
            if(accuracy < 0){
                accuracy = 0;
            }
            r1.updateStats((wpm*2).toFixed(0), accuracy);
            r2.updateStats((wpm/2.2).toFixed(0), accuracy);
            r3.updateStats(wpm, accuracy);
            r4.updateStats((wpm*1.2).toFixed(0), accuracy);
            r5.updateStats((wpm/3).toFixed(0), accuracy);
            timer();
        }, 1000);
    }else{
        //after race end functions could be introduced here.

        //display accuracy
        $('.error').addClass('showAccuracy').removeClass('hideAccuracy');
        return;
    }
};

function start(){
    $('.ty').bind('input',(evt)=>{
        if(!ended){
        if(!started){
            started = true;
            timer();
        }
        
        evt = evt || window.event;
        charTyped = String.fromCharCode(evt.which || evt.keyCode);
        ty_data = $('.ty'); 

        console.log(ty_data.val()+'|'+lst[lst_ptr].substring(0, word_ptr));

        if(subs(ty_data.val(), lst[lst_ptr].substring(0, word_ptr))){
            console.log(lst[lst_ptr].substring(0, word_ptr-1));
            $('.ty').val(lst[lst_ptr].substring(0, word_ptr-1));
            return;
        }

        //This code checks if inital spaces are added or not!
        if (!$('.ty').val().replace(/\s/g, '').length) {
            evt.preventDefault();
            $('.ty').val(''); 
            return;
        }
        

        //matches for the correct input
        if(ty_data.val() == lst[lst_ptr].substring(0, word_ptr)){

            //checks if there was any error or not.
            if(err_ack){
                console.log('afdadfasdfadfasdfsadfsadfasdfasdfadsf');
                err_ack = false;
            }

            cd += 1;

            movCursor(lst, lst_ptr, word_ptr);
            r1.animateProgress(cd, text_len/2);
            r2.animateProgress(cd, text_len*2.2);
            r3.animateProgress(cd, text_len);
            r4.animateProgress(cd, text_len/1.2);
            r5.animateProgress(cd, text_len*3);

            //check if last chracter of word is reached
            if(word_ptr == lst[lst_ptr].length){           
                $('.ty').val(''); 
                cc = cd;

                //checks if last character is of the text is reached or not.
                if(lst_ptr == limit){
                    started = false;
                    ended = true;
                    return;
                }
                word_ptr = 1;
                lst_ptr += 1;     
            }else{
                word_ptr = ty_data.val().length + 1;
            }
        }else{
            if(!err_ack){
                err_ack= true;
                error();
            }
        }
        }else{
            //something
        }
    });
}


class Progress{
    constructor(i, user){ //user has name and ID
        this.i = i;
        this.index = `#progress${i} > div:nth-child(1)`;
        this.name = user.name;
        this.id = user.id;
        this.svgDes = new ProgressBar.Circle(this.index, {
            strokeWidth: 5,
            easing: 'easeInOut',
            duration: 0,
            from: { color: 'rgba(77, 255, 77,1)' },
            to: { color: 'rgba(0, 184, 0,1)' },
            step: function(state, circle, attachment) {
                circle.path.setAttribute('stroke', state.color);
            },
            trailColor: '#121212',
            trailWidth: 0.02,
            svgStyle: null
          });
          this.populate();
    }

    populate(){
        $(`#progress${this.i} > div:nth-child(2) > div:nth-child(1)`).text(this.name);
        $(`#progress${this.i} .error`).text('100%');
        $(`#progress${this.i} .wpm`).text('0');
    }

    blinkStop() {
        console.log('stoping blink...');
    }

    updateStats(wp, acc){
        //update wpm
        $(`.wpm${this.i}`).html(`${wp}<br><div>WPM</div>`);
        $(`.error${this.i}`).text(`${acc}%`);
    }

    animateProgress(written, total){
        this.svgDes.animate(written/total);
    }
    
    test(){
        
    }
}

function subs(a, b){
    if(a == b){return false;}
    let bl = 0;
    for(let i=0; i<a.length; i++){
        if(a[i] == b[bl]){
            bl++;
            continue;
        }else{
            return false;
        }
    }
    return true;
}

function initializeText(data){
    console.log(data.slice(0, 1));
    $('.cursor').text(data.slice(0, 1));
    $('.tbt').text(data.slice(1, data.length));
}

function movCursor(lst, lp, wp){
    if(lp == lst.length-1 && wp == lst[lp].length){
        $('.typed').text(lst.slice(0, lp).join('')+lst[lp].substring(0, wp));  
        $('.cursor').text('');
        return;
    }
    if(lst[lp].length == wp){
        lp++;
        wp = 0;
    }

    $('.typed').text(lst.slice(0, lp).join('')+lst[lp].substring(0, wp));
    $('.cursor').text(lst[lp][wp]);
    $('.tbt').text(lst[lp].substring(wp+1, lst[lp].length) + lst.slice(lp+1, lst.length).join(''));
}


function bot(t){
    let ptr = 0;
    setInterval(() => {
        if(ptr < data.length){
            $('.ty').val($('.ty').val()+data[ptr]);
            // let e = $.Event("keypress", { which: 65, keyCode: 65 });
            $('.ty').trigger('input');
            ptr++;
        }
    },t);
}

function teset(){
    
}