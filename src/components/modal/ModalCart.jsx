import React, { Component } from 'react';
import './modalCart.css';

class ModalCart extends Component {
    constructor(props) {
        super(props)

    }

    render() {
        // console.log(this.props.active)
        return (
            <div className={this.props.active ? 'modal active' : 'modal'} onClick={() => this.props.changeModalCondition()}>
                <div className={this.props.active ? 'modal_content active' : 'modal_content'} onClick={e => e.stopPropagation()}>
                    <div>
                        <span>My bag,</span>3 items
                    </div>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default ModalCart;
