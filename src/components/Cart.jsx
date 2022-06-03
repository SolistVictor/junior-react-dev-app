import React, { Component } from 'react';
import './cart.css'


class Cart extends Component {
    constructor(props) {
        super(props)

    }

    displayCartProduct = () => {
        let data = this.props.data;

        if (data.loading) {
            return <div>Loading...</div>
        }
        else {
            return (
                <div className='main_cart'>
                    {data.categories[0].products.map((product, id) =>
                        <div className='cart_product' key={id}>
                            <div className='cart_product_info'>
                                <p>{product.name}</p>
                                <p style={{ fontWeight: 900 }}>{product.prices[0].currency.symbol}
                                    {product.prices[0].amount}
                                </p>
                                {product.attributes.map((attribute, id) =>
                                    <div className='cart_attribute' key={id}>
                                        <p>{attribute.name}:</p>
                                        {attribute.items.map((item, id) =>
                                            <button
                                                className='btn_size'
                                                style={{backgroundColor: item.value}}
                                                key={id}>
                                                {attribute.name === 'Color' ? '' : item.value}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className='cart_count'>
                                <button className='btn_count'>+</button>
                                <p style={{ fontWeight: '900' }}>1</p>
                                <button className='btn_count'>−</button>
                            </div>

                            <div className='cart_picture'>
                                <img className='cart_product_img' src={product.gallery[0]} alt="qwdqd" />
                            </div>
                        </div>
                    )}
                </div>
            )
        }
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
