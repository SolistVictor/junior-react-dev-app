import React, { Component } from 'react';
import { Context } from '../../context/Context';
import './modalCart.css';


class ModalCart extends Component {
    constructor(props) {
        super(props)

    }

    componentDidUpdate() {
        if (this.props.modalActive) {
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = 'unset';
        }
       
    }

    static contextType = Context;

    changeProductAttribute = (productId, attrId, itemId) => {
        this.context.changeSelectedProductAttribute(productId, attrId, itemId);
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

    displayModalCartItems = () => {
        let currencyIndex = this.context.state.currencyId;
        return (
            <div className='items'>
                {this.context.state.storeItems.map((product, id) =>
                    <div className='item' key={id}>
                        <div className='item_info'>
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
                                            onClick={() => this.changeProductAttribute(id, attrId, itemId)}
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
                            <p style={{ fontWeight: '900' }}>{product.counter}</p>
                            <button onClick={() => this.context.decreaseProductAmount(id, product.id)} className='btn_itemCount'>−</button>
                        </div>

                        <div >
                            <img className='item_img' src={product.gallery[product.imageIndex]} alt={product.gallery[product.imageIndex]} />
                        </div>
                    </div>
                )}
            </div>
        )
    }

    render() {
        return (
            <div className={this.props.modalActive ? 'modal active' : 'modal'} onClick={() => this.props.changeModalCondition()}>
                <div className={this.props.modalActive ? 'modal_content active' : 'modal_content'} onClick={e => e.stopPropagation()}>
                    <div style={{ marginBottom: '2rem' }}>
                        <span style={{ fontWeight: '700' }}>My bag, </span>{this.context.state.quantity} items
                    </div>
                    {this.displayModalCartItems()}

                    <div className='total'>
                        <p>Total</p>
                        <p>{this.context.state.totalPrice}</p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button className='btn_viewBag'>
                            View bag
                        </button>
                        <button className='btn_checkOut'>
                            Check out
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ModalCart;
