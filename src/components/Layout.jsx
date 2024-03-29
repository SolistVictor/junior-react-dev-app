import React, { Component } from 'react';
import './Layout.css';
import { graphql } from 'react-apollo';
import ModalCart from './modal/ModalCart';
import { Link } from 'react-router-dom';
import brand_icon from "../assets/icons/Brand_icon.png";
import cart_icon from "../assets/icons/Vector.png";
import vectorUp from '../assets/icons/VectorUp.png';
import vectorDown from '../assets/icons/VectorDown.png';
import { Context } from '../context/Context';
import {layoutQuery} from '../queries/queries';





class Layout extends Component {
    constructor(props) {
        super(props)

        this.state = {
            modalActive: false,
            isHidden: true,
            currencyId: 0,
            currencyData: undefined,
            cartItems: [],
            quantity: 0,
            totalPrice: 0,
            tax: 0,
        }
    }
    static getDerivedStateFromProps(props, state) {
        return { currencyData: props.data.currencies };
    }

    componentDidMount() {
        const raw = localStorage.getItem('data') || [];
        if (raw.length === 0) {
            return
        }
        this.setState(JSON.parse(raw));
    }

    componentDidUpdate() {
        //for update quantity and totalPrice
        let quantity = 0;
        for (let i = 0; i < this.state.cartItems.length; i++) {
            quantity += this.state.cartItems[i].counter;
        }
        if( this.state.quantity !== quantity) {
            this.calculatePrice();
        }
        localStorage.setItem('data', JSON.stringify(this.state));
    }

    closeModals = () => {
        this.setState({isHidden: true, modalActive: false});
    }

    displayCategories = () => {
        let data = this.props.data;
        if (data.loading) {
            return <div>Loading...</div>
        }
        else {
            return data.categories.map((category, id) =>
                <Link onClick={this.closeModals} to={`/${category.name}`} key={id}>
                    <button onClick={() => this.forceUpdate()}
                        value={category.name} className='btn_nav'>
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
                <div onClick={() => this.showCurrencyButtons()} className={this.state.isHidden ? 'currencies_wrapper' : 'currencies_wrapper active'}>
                    <div className='currencies'>
                        {data.currencies.map((item, id) =>
                            <button onClick={() => this.onCurrencyChange(id)} className='btn_symbol_label' key={id}>
                                {item.symbol}{' '}{item.label}
                            </button>
                        )}
                    </div>
                </div>
            )
        }
    }

    displayCurrencySymbol = () => {
        if (this.props.data.loading) {
            return <div>Loading...</div>
        }
        return (
            <button className='btn_showCurrencies'
                onClick={this.showCurrencyButtons}>
                {this.state.currencyData[this.state.currencyId].symbol}
            </button>
        )
    }

    onCurrencyChange = (id) => {
        let price = this.reCalculatePrice(id)
        this.setState({ currencyId: id, totalPrice: price.totalPrice, tax: price.tax });
        this.showCurrencyButtons();
    }

    showCurrencyButtons = () => {
        if(this.state.modalActive){
            return
        }
        this.setState({ isHidden: !this.state.isHidden })
    }

    changeModalState = () => {
        if(!this.state.isHidden){
            return
        }
        this.setState({ modalActive: !this.state.modalActive });
    }

    addItemToCart = (product, selectedAttributesId) => {
        localStorage.removeItem(product.id);
        loop:
        for (let i = 0; i < this.state.cartItems.length; i++) {
            if (this.state.cartItems[i].id === product.id) {
                //for airtag
                if(product.attributes.length === 0){
                    let item = this.state.cartItems[i];
                    item.counter++;
                    return this.setState({ cartItems: [...this.state.cartItems] })
                }
                for (let j = 0; j < this.state.cartItems[i].selectedAttributesId.length; j++) {
                    if (this.state.cartItems[i].selectedAttributesId[j] !== selectedAttributesId[j]) {
                        continue loop;
                    }
                }
                let item = this.state.cartItems[i];
                item.counter++;
                return this.setState({ cartItems: [...this.state.cartItems] })
            }
        }
        let item = { ...product, imageIndex: 0, counter: 1, selectedAttributesId: selectedAttributesId };
        this.setState({ cartItems: [...this.state.cartItems, item] });
    }

    removeCartProduct = (index, productId) => {
        let items = [...this.state.cartItems];
        for (let i = 0; i < items.length; i++) {
            if (items[i].id === productId) {
                items.splice(index, 1);
            }
        }
        this.setState({ cartItems: items })
    }

    increaseProductAmount = (index) => {
        let items = [...this.state.cartItems];
        items[index].counter++;
        this.setState({ cartItems: items });
        this.calculatePrice();
    }

    decreaseProductAmount = (index, productId) => {
        let items = [...this.state.cartItems];
        items[index].counter--;
        this.setState({ cartItems: [...items] });
        if (this.state.cartItems[index].counter < 1) {
            this.removeCartProduct(index, productId);
        }
        this.calculatePrice();
    }

    clickArrowRight = (length, index) => {
        let items = [...this.state.cartItems];
        if (this.state.cartItems[index].imageIndex < length - 1) {
            items[index].imageIndex++;
        }
        else {
            items[index].imageIndex = 0;
        }
        this.setState({ cartItems: [...items] });
    }

    clickArrowLeft = (length, index) => {
        let items = [...this.state.cartItems];
        if (this.state.cartItems[index].imageIndex > 0) {
            items[index].imageIndex--;
        }
        else if (this.state.cartItems[index].imageIndex === 0) {
            items[index].imageIndex = length - 1
        }
        this.setState({ cartItems: [...items] });
    }

    calculatePrice = () => {
        let price = 0;
        let quantity = 0;
        let tax = 0;
        for (let i = 0; i < this.state.cartItems.length; i++) {
            price += this.state.cartItems[i].prices[this.state.currencyId].amount * this.state.cartItems[i].counter;
            quantity += this.state.cartItems[i].counter;
        }
        tax = price * 0.21;
        this.setState({ quantity: quantity, totalPrice: (price + tax).toFixed(2), tax: tax.toFixed(2) });
    }

    reCalculatePrice = (id) => {
        let price = 0;
        let tax = 0;
        for (let i = 0; i < this.state.cartItems.length; i++) {
            price += this.state.cartItems[i].prices[id].amount * this.state.cartItems[i].counter;
        }
        tax = price * 0.21;
        return ({ totalPrice: (price + tax).toFixed(2), tax: tax.toFixed(2) });
    }



    render() {
        return (
            <Context.Provider value={{
                state: this.state,
                addItemToCart: this.addItemToCart,
                increaseProductAmount: this.increaseProductAmount,
                decreaseProductAmount: this.decreaseProductAmount,
                clickArrowRight: this.clickArrowRight,
                clickArrowLeft: this.clickArrowLeft,
                calculatePrice: this.calculatePrice,
            }}>
                <div className='container'>
                    <nav className='navbar'>
                        <div>
                            {this.displayCategories()}
                        </div>

                        <div className='brand'>
                            <img src={brand_icon} alt="" />
                        </div>

                        <div>
                            {this.displayCurrencySymbol()}

                            {/* vector_img */}
                            {this.state.isHidden ? <img src={vectorDown} alt="" /> : <img src={vectorUp} alt="" />}
                            {/* modal_cart_img */}
                            <button onClick={() => this.changeModalState()} className='btn_cart'>
                                <img className='cart_icon' src={cart_icon} alt="" />
                                {this.state.quantity > 0 ? <div className='circle'>{this.state.quantity}</div> : null}
                            </button>
                        </div>
                    </nav>

                    {this.state.isHidden ? null : this.displayCurrencies()}


                    <ModalCart modalActive={this.state.modalActive}
                        changeModalState={this.changeModalState}>
                    </ModalCart>



                    {this.props.children}
                </div>

            </Context.Provider>
        );
    }
}

export default graphql(layoutQuery)(Layout);
