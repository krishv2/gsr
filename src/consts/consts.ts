import { GridColDef } from "@mui/x-data-grid";

export const SNAPSHOT_TYPE = 'snapshot';
export const UPDATE_TYPE = 'l2update';
export const BUY_TYPE = 'buy';
export const SELL_TYPE = 'sell';
export const ERROR_TYPE = 'error';
export const CHANNEL = 'level2';
export const API_TYPE = 'subscribe';
export const WEBSOCKET_CALL = 'wss://ws-feed.exchange.coinbase.com';
export const CURRENCY_PAIR_API = 'https://api.exchange.coinbase.com/products';
export const COLUMNS: GridColDef[] = [
    { field: 'id', headerName: 'Id', hide: true },
    { field: 'size', headerName: 'Amount', width: 90, align: "center" },
    {
        field: 'price',
        headerName: 'Price',
        width: 150,
        align: "right",
    }
]