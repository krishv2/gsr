/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Chip, MenuItem, Select } from '@mui/material';
import { Order } from './models/OrderbookModel';
import { API_TYPE, BUY_TYPE, CHANNEL, COLUMNS, CURRENCY_PAIR_API, ERROR_TYPE, SELL_TYPE, SNAPSHOT_TYPE, UPDATE_TYPE, WEBSOCKET_CALL } from './consts/consts';
import { formatData, getId } from './utils/DataFormatter';
import './Orderbook.css';

export const Orderbook = () => {

    const [bids, setBids] = useState<Order[]>([]);
    const [asks, setAsks] = useState<Order[]>([]);
    const [buy, setBuy] = useState<any>([]);
    const [sell, setSell] = useState<any>([]);
    const [pairs, setPairs] = useState<string[]>([]);
    const [selectedPair, setSelectedPair] = useState<string>('ETH-USD');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const options = { method: 'GET', headers: { Accept: 'application/json' } };
        fetch(CURRENCY_PAIR_API, options)
            .then(response => response.json())
            .then(response => setPairs(response.map((r: { id: any; }) => r.id)))
            .catch(err => console.error(err));

    }, [])

    useEffect(() => {
        const ws = new WebSocket(WEBSOCKET_CALL);

        const apiCall = { type: API_TYPE, product_ids: [selectedPair], channels: [CHANNEL] };

        ws.onopen = () => {
            ws.send(JSON.stringify(apiCall));
        };

        ws.onmessage = (event) => {
            let jsonObject = JSON.parse(event.data);
            let bid = [];
            if (jsonObject.type === SNAPSHOT_TYPE) {

                bid = formatData(jsonObject.bids.slice(0, 10));
                let ask = formatData(jsonObject.asks.slice(0, 10));

                setBids(bid);
                setAsks(ask);
            }

            if (jsonObject.type === UPDATE_TYPE) {
                if (jsonObject.changes[0][0] === BUY_TYPE) {
                    setBuy(jsonObject.changes[0]);
                }
                if (jsonObject.changes[0][0] === SELL_TYPE) {
                    setSell(jsonObject.changes[0]);
                }
                if (jsonObject.changes[0][0] === ERROR_TYPE) {
                    setError(jsonObject.message);
                }
            }


        }

        ws.onclose = () => {
            ws.close();
        };

        return () => {
            ws.close();
        };
    }, [selectedPair]);


    useEffect(() => {
        let orderbook: Order[] = bids;

        if (bids.length > 0) {
            let minValue = bids[bids.length - 1].price;

            if (parseFloat(buy[1]) >= parseFloat(minValue)) {

                if (parseFloat(buy[2]) === 0) {

                    let result = orderbook.filter((order) => order.price !== buy[1]);

                    setBids(result)

                } else if (orderbook.find((order) => order.price === buy[1])) {

                    orderbook.forEach((order) => {
                        if (order.price === buy[1]) {
                            order.size = buy[2];
                        }
                    })

                    setBids(orderbook);
                }
                else {
                    let id = getId();
                    let newRecord = { "id": id, "size": buy[2], "price": buy[1] };

                    orderbook = [...bids, newRecord];
                    orderbook.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                    if (orderbook.length !== 10) {
                        let orderSlice = orderbook.slice(0, 10);
                        setBids(orderSlice);
                    }
                    else {
                        setBids(orderbook);
                    }
                }
            }
        }
    }, [buy])


    useEffect(() => {
        let orderbook: Order[] = asks;

        if (asks.length > 0) {
            let minValue = asks[asks.length - 1].price;

            if (parseFloat(sell[1]) <= parseFloat(minValue)) {

                if (parseFloat(sell[2]) === 0) {

                    let result = orderbook.filter((order) => order.price !== sell[1]);

                    setAsks(result)

                } else if (orderbook.find((order) => order.price === sell[1])) {

                    orderbook.forEach((order) => {
                        if (order.price === sell[1]) {
                            order.size = sell[2];
                        }
                    })

                    setAsks(orderbook);
                }
                else {
                    let id = getId();
                    let newRecord = { "id": id, "size": sell[2], "price": sell[1] };

                    orderbook = [...asks, newRecord];
                    orderbook.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                    if (orderbook.length !== 10) {
                        let orderSlice = orderbook.slice(0, 10);
                        setAsks(orderSlice);
                    }
                    else {
                        setAsks(orderbook);
                    }
                }
            }
        }
    }, [sell])

    return (
        <div className='Orderbook-Container'>
            {!error ? (
                <><div className='Orderbook-bid'>
                    <label>Bids</label>
                    <DataGrid rows={bids} columns={COLUMNS} />
                </div><div className='Orderbook-ask'>
                        <label>Asks</label>
                        <DataGrid rows={asks} columns={COLUMNS} />
                    </div><div>
                        <div className='Currency-Pair'>
                            <label>Currency pairs</label>
                            <Select
                                value={selectedPair}
                                onChange={(event) => setSelectedPair(event?.target.value)}
                                label="Pairs"
                            >
                                {pairs.map((p: any) => {

                                    return (
                                        <MenuItem value={p}>{p}</MenuItem>
                                    );
                                })}
                            </Select>
                        </div>
                    </div></>) : (<div className='Error'><Chip label={error} /></div>)}
        </div>

    );


}