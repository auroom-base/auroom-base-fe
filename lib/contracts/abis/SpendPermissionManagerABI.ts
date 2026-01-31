export const SpendPermissionManagerABI = [
    {
        "type": "function",
        "name": "approveWithSignature",
        "inputs": [
            {
                "name": "spendPermission",
                "type": "tuple",
                "components": [
                    { "name": "account", "type": "address" },
                    { "name": "spender", "type": "address" },
                    { "name": "token", "type": "address" },
                    { "name": "allowance", "type": "uint160" },
                    { "name": "period", "type": "uint48" },
                    { "name": "start", "type": "uint48" },
                    { "name": "end", "type": "uint48" },
                    { "name": "salt", "type": "uint256" },
                    { "name": "extraData", "type": "bytes" }
                ]
            },
            { "name": "signature", "type": "bytes" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "spend",
        "inputs": [
            {
                "name": "spendPermission",
                "type": "tuple",
                "components": [
                    { "name": "account", "type": "address" },
                    { "name": "spender", "type": "address" },
                    { "name": "token", "type": "address" },
                    { "name": "allowance", "type": "uint160" },
                    { "name": "period", "type": "uint48" },
                    { "name": "start", "type": "uint48" },
                    { "name": "end", "type": "uint48" },
                    { "name": "salt", "type": "uint256" },
                    { "name": "extraData", "type": "bytes" }
                ]
            },
            { "name": "value", "type": "uint160" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "approve",
        "inputs": [
            {
                "name": "spendPermission",
                "type": "tuple",
                "components": [
                    { "name": "account", "type": "address" },
                    { "name": "spender", "type": "address" },
                    { "name": "token", "type": "address" },
                    { "name": "allowance", "type": "uint160" },
                    { "name": "period", "type": "uint48" },
                    { "name": "start", "type": "uint48" },
                    { "name": "end", "type": "uint48" },
                    { "name": "salt", "type": "uint256" },
                    { "name": "extraData", "type": "bytes" }
                ]
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "getHash",
        "inputs": [
            {
                "name": "spendPermission",
                "type": "tuple",
                "components": [
                    { "name": "account", "type": "address" },
                    { "name": "spender", "type": "address" },
                    { "name": "token", "type": "address" },
                    { "name": "allowance", "type": "uint160" },
                    { "name": "period", "type": "uint48" },
                    { "name": "start", "type": "uint48" },
                    { "name": "end", "type": "uint48" },
                    { "name": "salt", "type": "uint256" },
                    { "name": "extraData", "type": "bytes" }
                ]
            }
        ],
        "outputs": [{ "name": "", "type": "bytes32" }],
        "stateMutability": "view"
    }
] as const;
