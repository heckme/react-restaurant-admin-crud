import React,{Component} from 'react';
import {connect} from "react-redux";
import Dessert from "../../components/view/dessert";
import {getDesserts} from "../../actions/dessertActions";
import $ from 'jquery'; 
class ShowDesserts extends Component{
    constructor(props){
        super(props);
        this.state={
            currentPage:1,
            totalItems:0,
            maxItemsPerPage:4,
            dessertsToShow:[
                { 
                    id: "1DESRT", name: "Rice with Milk", 
                    description: "Sweet rice with cinnamon and sweet cream",
                    picture:'/img/desserts/rice-with-milk.jpg' ,
                    price:5.50
                },
                { 
                    id: "2DESRT", 
                    name: "Choco Strawberries", 
                    description: "Strawberries covered with Chocolate", 
                    picture:'/img/desserts/choco-strawberries.jpg',
                    price:7.50
                },
                { 
                    id: "3DESRT", 
                    name: "Ice Cream and Caramel", 
                    description: "Chocolate ice cream on the crust", 
                    picture:'/img/desserts/ice-cream-and-caramel.jpg',
                    price:8.50
                }
            ],
            firstItemToShow:0,
            totalPagination:[1,2]
        }
        this.getPrevPage = this.getPrevPage.bind(this);
        this.getNextPage = this.getNextPage.bind(this); 
    }
    async componentDidMount(){
        await this.props.getDesserts();
        const {desserts}= this.props;
        this.setState({
            totalItems:desserts.length
        });
        this.setDessertsItems();
        var tempTotalPages=Math.round(this.state.totalItems/this.state.maxItemsPerPage);
        var tempItems=[];
        for (let index = 1; index <= tempTotalPages; index++) {
            tempItems.push(index);
        }
        this.setState({
            totalPagination:tempItems
        });
    }
    setDessertsItems=()=>{
        const {desserts}=this.props;
        var tempDessertsToShow=[];
        var maxItemsLenght=parseInt(this.state.maxItemsPerPage*this.state.currentPage);
        try {
            let index = this.state.firstItemToShow;
            if(maxItemsLenght>desserts.length){
                maxItemsLenght=desserts.length;
            }
            do{ 
                if(desserts[index].name!==null   ){
                    tempDessertsToShow.push(desserts[index]);
                }
                this.setState({
                    dessertsToShow:tempDessertsToShow
                })
                index++;
            }
            while(index <=maxItemsLenght);
        } 
        catch (error) {
            console.log('An error occurs no worried about');
            console.log(error);
        }
    }
    renderDesserts=()=>{
        if(this.state.dessertsToShow.length===0){
            return(
                <div>
                    Loading
                </div>
            )
        }
        else{
            return(
                this.state.dessertsToShow.map(dessert=>
                    <Dessert key={dessert.id} info={dessert}/> 
                )
            )
        }
    }
    getNextPage(){ 
        if($('.page-nav').hasClass('active')){
            $('.page-nav').removeClass('active');
        }
        if(this.state.currentPage<=this.state.totalPagination.length){
            var tempCurrentPage=this.state.currentPage+1;
            var tempFirstItemToShow=(tempCurrentPage*this.state.maxItemsPerPage)-parseInt(this.state.maxItemsPerPage);
            this.setState({
                currentPage:tempCurrentPage,
                firstItemToShow:tempFirstItemToShow
            });
            setTimeout(() => {
                $('.page-nav:nth-child('+ parseInt(this.state.currentPage+1)+')').addClass('active');
                this.setDessertsItems();
            }, 200);
        }
    }
    getPrevPage(){
        if($('.page-nav').hasClass('active')){
            $('.page-nav').removeClass('active');
        }
        if(this.state.currentPage>1){
            var tempCurrentPage=this.state.currentPage-1;
            var tempFirstItemToShow=(tempCurrentPage*this.state.maxItemsPerPage)-parseInt(this.state.maxItemsPerPage);
            this.setState({
                firstItemToShow:tempFirstItemToShow,
                currentPage:tempCurrentPage
            });
            setTimeout(() => {
                $('.page-nav:nth-child('+ parseInt(this.state.currentPage+1)+')').addClass('active');
                this.setDessertsItems();
            }, 300); 
        }
    }
    getPage=(e,index)=>{
        var tempFirstItemToShow=(index*this.state.maxItemsPerPage)-parseInt(this.state.maxItemsPerPage);
        if($('.page-nav').hasClass('active')){
            $('.page-nav').removeClass('active');
        }
        setTimeout(() => {
            $('.page-nav:nth-child('+ parseInt(index+1)+')').addClass('active');
            this.setState({
                currentPage:index,
                firstItemToShow:tempFirstItemToShow
            });
            this.setDessertsItems(); 
        }, 300);
        
    }
    getPagination=()=>{
        return(
            <React.Fragment>
                <div style={{textAlign:'center'}}>
                    <nav id="pagination-bottom">
                        <ul className="pagination">
                            <li className="page-item">
                                <a className="page-link" onClick={()=>this.getPrevPage()}>Previous</a>
                            </li> 
                            {
                                this.state.totalPagination.map((index,key)=> 
                                    <li className="page-item page-nav">
                                        <a className="page-link" onClick={(e)=>this.getPage(e,index)}>{index}</a>
                                    </li>
                                )
                            }
                            <li className="page-item">
                                <a className="page-link" onClick={()=>this.getNextPage()}>Next</a>
                            </li> 
                        </ul>
                    </nav>
                </div>
            </React.Fragment>
        )
    }
    render(){
        const {desserts}=this.props;
        if(!desserts){
            return(
                <div>
                    <p>Loading Data From Database ,please Wait...</p>
                </div>
            )
        }
        return(
            <React.Fragment>
                <div className="row justify-content-center">
                    <div className="col-md-9">
                        <ul>
                            {
                                this.renderDesserts()
                            }
                            {
                                this.getPagination()
                            }
                        </ul>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
const mapStateToProps=state=>({
    desserts:state.desserts.desserts
})
export default connect(mapStateToProps,{getDesserts})(ShowDesserts);