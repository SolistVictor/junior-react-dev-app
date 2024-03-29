import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../../context/Context';
import './modalCart.css';


class ModalCart extends Component {

    static contextType = Context;

    componentDidUpdate() {
        if (this.props.modalActive) {
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = 'unset';
        }

    }

    styleSwitcher = (id, attrId, name, product) => {
        if (product.selectedAttributesId[attrId] === id && name === 'Color') {
            return 'btn_itemColor_selected'
        }
        if (name === 'Color') {
            return 'btn_itemColor'
        }
        if (product.selectedAttributesId[attrId] === id && name !== 'Color') {
            return 'btn_itemSize_selected'
        }
        else if (name !== 'Color') {
            return 'btn_itemSize'
        }
    }

    displayCurrencySymbol = () => {
        if (this.context.state.currencyData === undefined) {
            return;
        }
        return this.context.state.currencyData[this.context.state.currencyId].symbol;
    }

    displayModalCartItems = () => {
        let currencyIndex = this.context.state.currencyId;
        return (
            <div className='items'>
                {this.context.state.cartItems.map((product, id) =>
                    <div className='item' key={id}>
                        <div className='item_info'>
                            <p className='title'>{product.brand}</p>
                            <p className='title'>{product.name}</p>
                            <p className='price'>
                                {product.prices[currencyIndex].currency.symbol}
                                {product.prices[currencyIndex].amount}
                            </p>
                            {product.attributes.map((attribute, attrId) =>
                                <div key={attrId}>
                                    <p className='attribute_title'>{attribute.name}:</p>
                                    {attribute.items.map((item, itemId) =>
                                        <button
                                            className={this.styleSwitcher(itemId, attrId, attribute.name, product)}
                                            style={{ backgroundColor: item.value }}
                                            key={itemId}>
                                            {attribute.name === 'Color' ? '' : item.value}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className='item_count'>
                            <button onClick={() => this.context.increaseProductAmount(id)} className='btn_itemCount'>+</button>
                            <p className='p_counter'>{product.counter}</p>
                            <button onClick={() => this.context.decreaseProductAmount(id, product.id)} className='btn_itemCount'>−</button>
                        </div>

                        <div className='image_container'>
                            <img className='item_img' src={product.gallery[product.imageIndex]} alt='' />
                        </div>
                    </div>
                )}
            </div>
        )
    }

    render() {
        return (
            <div className={this.props.modalActive ? 'modal active' : 'modal'} onClick={() => this.props.changeModalState()}>
                <div className={this.props.modalActive ? 'modal_content active' : 'modal_content'} onClick={e => e.stopPropagation()}>
                    <div className='quantity'>
                        <span>My bag, </span>{this.context.state.quantity} items
                    </div>
                    {this.displayModalCartItems()}

                    <div className='total'>
                        <p>Total</p>
                        <p>{this.displayCurrencySymbol()}{this.context.state.totalPrice}</p>
                    </div>

                    <div className='links'>
                        <Link to='/cart'>
                            <button onClick={() => this.props.changeModalState()} className='btn_viewBag'>
                                View bag
                            </button>
                        </Link>
                        <Link to='/all'>
                            <button onClick={() => this.props.changeModalState()} className='btn_checkOut'>
                                Check out
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default ModalCart;
