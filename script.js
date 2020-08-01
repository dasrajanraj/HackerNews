const content_list = document.getElementById('content-list');
const loader = document.getElementById('loader');
const loadMore = document.getElementById('LoadMore');
let currentPage = '';
let start;
let stop;
    function HackerNews(){
        let newItems = []
        let topItems = []
        let bestItems = []
        let newItemsList = []
        let topItemsList = []        
        let bestItemsList = []


        function Setup(url, arrayList , arr){
            fetch(url)
                .then( response => response.json())
                .then((data) => {
                    arrayList = data
                    for( let i=start;i<stop;i++){
                        if(localStorage.getItem(arrayList[i]) !== null){
                            let item = localStorage.getItem(arrayList[i])
                            item = JSON.parse(item);
                            arr.push(item);
                            content_list.innerHTML+= `<li>
                                <p class="title">${item.title}</p>
                                <p class="subtitle">${item.score} points by ${item.by} ${item.time} | ${item.descendants} comments</p>
                            </li>`
                        }else{
                            fetch(`https://hacker-news.firebaseio.com/v0/item/${arrayList[i]}.json?print=pretty`)
                            .then( response => response.json())
                            .then( data => {
                                if(data !== null){
                                    let item = JSON.stringify(data);    
                                    localStorage.setItem(arrayList[i], item)
                                    arr.push(data);
                                    content_list.innerHTML+= `<li>
                                        <p class="title">${data.title}</p>
                                        <p class="subtitle">${data.score} points by ${data.by} ${data.time} | ${data.descendants} comments</p>
                                    </li>`
                                }else{
                                    console.log("empty data found")
                                }
                            })
                            .catch((error)=>{console.log(error)})
                        }
                    }
                })
                .catch((err)=> console.log(err))
        }

        //render New posts
        this.renderNew=()=>{
            url = "https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty"
            Setup( url ,newItemsList , newItems);        
        }
        //render Top posts
        this.renderTop= ()=>{
            url = "https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty"
            Setup( url ,topItemsList , topItems)
            
        }

        //render Best posts
        this.renderBest=()=>{
            url = "https://hacker-news.firebaseio.com/v0/beststories.json?print=pretty"
            Setup( url ,bestItemsList , bestItems)
        
        }
        Object.defineProperty(this , 'newItems' , {
            get : ()=> newItems
        })
        Object.defineProperty(this , 'topItems' , {
            get : ()=> topItems
        })
        Object.defineProperty(this , 'bestItems' , {
            get : ()=> bestItems
        })
    }

function shiftTab(tab){
    start =0;
    stop = start + 20;
    render(tab);
    content_list.innerHTML=""
}


function render(link){
    let hnew = new HackerNews();
    if( link !== currentPage){
        start =0;
        stop = start + 20;
        content_list.innerHTML = '';
    }
    currentPage = link;
    switch(link){
        case 'New': hnew.renderNew();
                    break;
        case 'Top': hnew.renderTop();
                    break;
        case 'Best': hnew.renderBest();
                    break;
        default : hnew.renderNew();            
    }
}
function LoadMore(){
    loadMore.style.display="none";
    loader.style.display ="block";
    setTimeout(()=>{
        start = stop;
        stop = stop +20;
        loader.style.display ="none"
        loadMore.style.display="block";
        render(currentPage);
    },3000)
}
  

shiftTab('New')
