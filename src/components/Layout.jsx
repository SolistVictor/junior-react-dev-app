import React, { Component } from 'react';
import './Layout.css';
import { gql } from 'apollo-boost';
import { graphql } from 'react-apollo';
import ModalCart from './modal/ModalCart';
import { Link } from 'react-router-dom';
import brand_icon from "../assets/icons/Brand_icon.png";
import cart_icon from "../assets/icons/Vector.png";
import vectorUp from '../assets/icons/VectorUp.png';
import vectorDown from '../assets/icons/VectorDown.png';
import { Context } from '../context/Context';





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
            currencyId: 0,
            currencyData: this.props.data,
            storeItems: [],
            quantity: 0,
            totalPrice: 0,
            tax: 0,
            selectedProducts: []

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
                <Link to='/' key={id}>
                    <button onClick={e => this.setState({ categoryName: e.target.value })}
                        id={id} value={category.name} className='btn_nav'>
                        {category.name}
                    </button>
                </Link>

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
                        <button onClick={() => this.onCurrencyChange(id)} className='btn_symbol_label' key={id}>
                            {item.symbol}{' '}{item.label}
                        </button>
                    )}
                </div>
            )
        }
    }

    displayCurrencySymbol = () => {
        if (this.state.currencyData.loading) {
            return <div>Loading...</div>
        }

        return (
            <button className='btn_showCurrencies'
                onClick={this.showCurrencyButtons}>
                {this.state.currencyData.currencies[this.state.currencyId].symbol}
            </button>
        )
    }

    onCurrencyChange = (id) => {
        let price = this.reCalculatePrice(id)
        this.setState({ currencyId: id, totalPrice: price.totalPrice, tax: price.tax });
        this.showCurrencyButtons();
    }

    showCurrencyButtons = () => {
        this.setState({ isHide: !this.state.isHide })
    }

    changeModalCondition = () => {
        this.setState({ modalActive: !this.state.modalActive });
    }

    addCartItemToStore = (product, selectedAttributes) => {
        // for (let i = 0; i < this.state.storeItems.length; i++) {
        //     if (this.state.storeItems[i].id === product.id) {
        //         let newItems = [...this.state.storeItems];
        //         newItems[i].counter++;
        //         this.setState({ storeItems: [...newItems] });
        //         return;
        //     }
        // }
        let item = { ...product, imageIndex: 0, counter: 1, selectedAttributes: selectedAttributes };
        this.setState({ storeItems: [...this.state.storeItems, item] });
        this.calculatePrice();
    }

    removeCartProduct = (index, productId) => {
        let items = [...this.state.storeItems];
        for (let i = 0; i < items.length; i++) {
            if (items[i].id === productId) {
                items.splice(index, 1);
            }
        }
        this.setState({ storeItems: items })
        // this.setState({
        //     storeItems: this.state.storeItems.filter(product => {
        //         return product.id !== id;
        //     })
        // })
    }

    increaseProductAmount = (index) => {
        let items = [...this.state.storeItems];
        items[index].counter++;
        this.setState({ storeItems: [...items] });
        this.calculatePrice();
    }

    decreaseProductAmount = (index, productId) => {
        let items = [...this.state.storeItems];
        items[index].counter--;
        this.setState({ storeItems: [...items] });
        if (this.state.storeItems[index].counter < 1) {
            this.removeCartProduct(index, productId);
        }
        this.calculatePrice();
    }

    clickArrowRight = (length, index) => {
        let items = [...this.state.storeItems];
        if (this.state.storeItems[index].imageIndex < length - 1) {
            items[index].imageIndex++;
        }
        else {
            items[index].imageIndex = 0;
        }
        this.setState({ storeItems: [...items] });
    }

    clickArrowLeft = (length, index) => {
        let items = [...this.state.storeItems];
        if (this.state.storeItems[index].imageIndex > 0) {
            items[index].imageIndex--;
        }
        else if (this.state.storeItems[index].imageIndex === 0) {
            items[index].imageIndex = length - 1
        }
        this.setState({ storeItems: [...items] });
    }

    changeSelectedProductAttribute = (productId, attrId, itemId) => {
        let items = this.state.storeItems;
        items[productId].selectedAttributes[attrId] = itemId;
        this.setState({ storeItems: items });
    }

    calculatePrice = () => {
        let price = 0;
        let quantity = 0;
        let tax = 0;
        for (let i = 0; i < this.state.storeItems.length; i++) {
            price += this.state.storeItems[i].prices[this.state.currencyId].amount * this.state.storeItems[i].counter;
            quantity += this.state.storeItems[i].counter;
        }
        tax = price * 0.21;
        this.setState({ quantity: quantity, totalPrice: (price + tax).toFixed(2), tax: tax.toFixed(2) });
    }

    reCalculatePrice = (id) => {
        let price = 0;
        let tax = 0;
        for (let i = 0; i < this.state.storeItems.length; i++) {
            price += this.state.storeItems[i].prices[id].amount * this.state.storeItems[i].counter;
        }
        tax = price * 0.21;
        return ({ totalPrice: (price + tax).toFixed(2), tax: tax.toFixed(2) });
    }



    render() {
        return (
            <Context.Provider value={{
                state: this.state,
                currencySwitcher: this.currencySwitcher,
                addCartItemToStore: this.addCartItemToStore,
                increaseProductAmount: this.increaseProductAmount,
                decreaseProductAmount: this.decreaseProductAmount,
                clickArrowRight: this.clickArrowRight,
                clickArrowLeft: this.clickArrowLeft,
                changeSelectedProductAttribute: this.changeSelectedProductAttribute,
                summaryPrice: this.calculatePrice
            }}>
                <div className='container'>
                    <nav className='navbar'>
                        <div>
                            {this.displayCategory()}
                        </div>

                        <div className='brand'>
                            <img src={brand_icon} alt="" />
                        </div>

                        <div>
                            {this.displayCurrencySymbol()}

                            {/* vector_img */}
                            {this.state.isHide ? <img src={vectorDown} alt="cart" /> : <img src={vectorUp} alt="cart" />}
                            {/* modal_cart_img */}
                            <button onClick={() => this.setState({ modalActive: true })} className='btn_cart'>
                                <img className='cart_icon' src={cart_icon} alt="cart" />
                                {this.state.quantity > 0 ? <div className='circle'>{this.state.quantity}</div> : null}
                            </button>
                        </div>
                    </nav>

                    {this.state.isHide ? null : this.displayCurrencies()}


                    <ModalCart modalActive={this.state.modalActive}
                        changeModalCondition={this.changeModalCondition}>
                    </ModalCart>



                    {this.props.children}
                </div>

            </Context.Provider>
        );
    }
}

export default graphql(query)(Layout);
