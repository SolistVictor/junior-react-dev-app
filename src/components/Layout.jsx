import React, { Component } from 'react';
import './Layout.css';
import { gql } from 'apollo-boost';
import { graphql } from 'react-apollo';
import { Context } from '../context/Context';
import ModalCart from './modal/ModalCart';
import { Link } from 'react-router-dom';
import brand_icon from "../assets/icons/Brand_icon.png";
import cart_icon from "../assets/icons/Vector.png";
import vectorUp from '../assets/icons/VectorUp.png';
import vectorDown from '../assets/icons/VectorDown.png';




const query = gql`
{
    categories{
        name
    }
    currencies{
        symbol
        label
    }
}
`


class Layout extends Component {
    constructor(props) {
        super(props)

        this.state = {
            categoryName: 'all',
            modalActive: false,
            isHide: true,
            currencyLabel: 'USD',
            currencyData: this.props.data
        }
    }
    static getDerivedStateFromProps(props, state) {
        return { currencyData: props.data };
      }




    displayCategory = () => {
        let data = this.props.data;
        if (data.loading) {
            return <div>Loading...</div>
        }
        else {
            return data.categories.map((category, id) =>
                <button onClick={e => this.setState({ categoryName: e.target.value })}
                    id={id} key={id} value={category.name} className='btn_nav'>{category.name}</button>
            )

        }
    }

    displayCurrencies = () => {
        let data = this.props.data;
        if (data.loading) {
            return <div>Loading...</div>
        }
        else {
            return (

                <div className='currencies'>
                    {data.currencies.map((item, id) =>
                        <button onClick={() => this.clickCurrencyLabel(item.label)} className='btn_symbol_label' key={id}>
                            {item.symbol}{' '}{item.label}
                        </button>
                    )}
                </div>
            )
        }
    }

    clickCurrencyLabel = (label) => {
        this.setState({ currencyLabel: label });
        this.setState({ isHide: true });
    }

    currencySwitcher = (label) => {
        let index;
        if (label === 'USD') {
            index = 0;
        }
        else if (label === 'GBP') {
            index = 1;

        }
        else if (label === 'AUD') {
            index = 2;

        }
        else if (label === 'JPY') {
            index = 3;

        }
        else if (label === 'RUB') {
            index = 4;
        }
        return index;
    }

    displayCurrencySymbol = () => {

        let index = this.currencySwitcher(this.state.currencyLabel);

        if (this.state.currencyData.loading) {
            return <div>Loading...</div>
        }
        
        return (
            <button className='btn_showCurrencies'
                onClick={this.showCurrenciesButtons}>
                {this.state.currencyData.currencies[index].symbol}
            </button>
        )
    }


    showCurrenciesButtons = () => {
        this.setState({ isHide: !this.state.isHide })
    }



    changeModalCondition = () => {
        this.setState({ modalActive: false })
    }




    render() {
        return (
            <Context.Provider value={{state: this.state, currencySwitcher: this.currencySwitcher}}>
                <div className='container'>
                    <nav className='navbar'>
                        <div>
                            {this.displayCategory()}
                        </div>

                        <button className='btn_brand'>
                            <Link to='/cart'>
                                <img src={brand_icon} alt="" />
                            </Link>
                        </button>

                        <div>
                            {this.displayCurrencySymbol()}

                            {/* vector_img */}
                            {this.state.isHide ? <img src={vectorDown} alt="cart" /> : <img src={vectorUp} alt="cart" />}
                            {/* modal_cart_img */}
                            <button onClick={() => this.setState({ modalActive: true })} className='btn_cart'>
                                <img src={cart_icon} alt="cart" />
                            </button>
                        </div>
                    </nav>

                    {this.state.isHide ? null : this.displayCurrencies()}


                    <ModalCart active={this.state.modalActive}
                        changeModalCondition={this.changeModalCondition}>
                    </ModalCart>



                    {this.props.children}
                </div>
            </Context.Provider>
        );
    }
}

export default graphql(query)(Layout);
