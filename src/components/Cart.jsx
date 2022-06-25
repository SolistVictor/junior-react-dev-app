import React, { Component } from 'react';
import { Context } from '../context/Context';
import './cart.css';
import arrowLeft from '../assets/icons/arrowLeft.png';
import arrowRight from '../assets/icons/arrowRight.png';


class Cart extends Component {
    constructor(props) {
        super(props)

    }

    static contextType = Context;

    componentDidMount() {
        this.context.summaryPrice()
    }

    displayArrows(product, productId) {
        if (product.gallery.length <= 1) {
            return null;
        }
        return (
            <div style={{ position: 'relative' }}>
                <button onClick={() => this.context.clickArrowLeft(product.gallery.length, productId)} className='btn_arrowLeft'>
                    <img src={arrowLeft} alt="arrowLeft" />
                </button>
                <button onClick={() => this.context.clickArrowRight(product.gallery.length, productId)} className='btn_arrowRight'>
                    <img src={arrowRight} alt="arrowRight" />
                </button>
            </div>
        )
    }

    styleSwitcher = (id, attrId, name, product) => {
        if (product.selectedAttributes[attrId] === id && name === 'Color') {
            return 'btn_color_selected'
        }
        if (name === 'Color') {
            return 'btn_color'
        }
        if (product.selectedAttributes[attrId] === id && name !== 'Color') {
            return 'btn_size_selected'
        }
        else if (name !== 'Color') {
            return 'btn_size'
        }
    }

    changeProductAttribute = (productId, attrId, itemId) => {
        this.context.changeSelectedProductAttribute(productId, attrId, itemId);
    }

    displayCurrencySymbol = () => {
        if (this.context.state.currencyData.loading) {
            return;
        }
        return this.context.state.currencyData.currencies[this.context.state.currencyId].symbol;
        
    }

    displayCartProduct = () => {
        let currencyIndex = this.context.state.currencyId;
        return (
            <div className='main_cart'>
                {this.context.state.storeItems.map((product, productId) =>
                    <div className='cart_product' key={productId}>
                        <div className='cart_product_info'>
                            <p className='p_productName'>{product.name}</p>
                            <p style={{ fontWeight: 900 }}>
                                {product.prices[currencyIndex].currency.symbol}
                                {product.prices[currencyIndex].amount}
                            </p>
                            {product.attributes.map((attribute, attrId) =>
                                <div className='cart_attribute' key={attrId}>
                                    <p className='p_cartAttribute'>{attribute.name}:</p>
                                    <div>
                                        {attribute.items.map((item, itemId) =>
                                            <button
                                                className={this.styleSwitcher(itemId, attrId, attribute.name, product)}
                                                style={{ backgroundColor: item.value }}
                                                key={itemId}>
                                                {attribute.name === 'Color' ? '' : item.value}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className='cart_count'>
                            <button onClick={() => this.context.increaseProductAmount(productId)} className='btn_count'>+</button>
                            <p style={{ fontWeight: '900' }}>{product.counter}</p>
                            <button onClick={() => this.context.decreaseProductAmount(productId, product.id)} className='btn_count'>−</button>
                        </div>

                        <div className='cart_picture'>
                            <img className='cart_product_img' src={product.gallery[product.imageIndex]} alt="qwdqd" />
                            {this.displayArrows(product, productId)}
                        </div>
                    </div>
                )}

                <div>
                    <div className='border'></div>
                    <div className='cart_order'>
                        <div>  
                            Tax 21%: {this.displayCurrencySymbol()}{this.context.state.tax}
                        </div>
                        <div>Quantity: <span style={{ fontWeight: '700' }}>
                            {this.context.state.quantity}
                        </span></div>
                        <div>Total: <span style={{ fontWeight: '700' }}>
                            {this.displayCurrencySymbol()}{this.context.state.totalPrice}
                        </span></div>
                        <button className='btn_order btn_add'>Order</button>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.displayCartProduct()}
            </div>
        );
    }
}

export default Cart;
