import React, {Component} from 'react';
import PropTypes from 'prop-types';

const images = require.context('../../Image', true);

export default class Table extends Component {
    static propTypes = {
        columns: PropTypes.array.isRequired,
        items: PropTypes.array.isRequired,
        editItem: PropTypes.func.isRequired
    };

    render() {
        const {columns, items, editItem} = this.props;

        return (
            <div className="table tableProduct">
                <div className="table-header">
                    {columns.map((value, key) => {
                        let style = {width: value.width};

                        return <div className="table-header-item" style={style} key={key}>{value.name}</div>;
                    })}
                </div>
                {items.map((item, k) => {
                    return <div key={k} className="table-line">
                        {columns.map((value, key) => {
                            let style = {width: value.width};

                            if (value.property === 'actions') {
                                return <div className="table-item" style={style} key={key}>
                                    <button className='btn btn-info' onClick={() => editItem(item)} style={{marginRight: '10px'}}>Edit</button>
                                </div>;
                            }
                            if(value.property === 'picture'){
                                return <div className="table-item" style={style} key={key}><img src={images(`./${item[value.property]}`)} style={{height: '75px', width: '75px'}} key={key} /></div>;
                            } else {
                                return <div className="table-item" style={style} key={key}>{item[value.property]}</div>;
                            }
                        })}
                    </div>;
                })}

            </div>
        );
    }
}
