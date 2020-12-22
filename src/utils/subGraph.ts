// import fetch from 'isomorphic-fetch';
// import * as allPools from 'allPublicPools.json';

const SUBGRAPH_URL =
    process.env.REACT_APP_SUBGRAPH_URL ||
    'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer';

const HARDCODED_POOLS = {
    data: {
        pools0: [
            {
                id: '0x5cf2f4c435f4027c80ee7ce430faf815ef6875b0',
                publicSwap: false,
                swapFee: '0.001',
                tokens: [
                    {
                        address: '0x475b5b1b668a221b703e42f095a48809a5cabddc',
                        balance: '50',
                        decimals: 18,
                        denormWeight: '5',
                        id:
                            '0x5cf2f4c435f4027c80ee7ce430faf815ef6875b0-0x475b5b1b668a221b703e42f095a48809a5cabddc',
                        symbol: 'WETH',
                    },
                    {
                        address: '0xe4bff123943bd647cbf435cddab0b1501b26ae4b',
                        balance: '20',
                        decimals: 18,
                        denormWeight: '5',
                        id:
                            '0x5cf2f4c435f4027c80ee7ce430faf815ef6875b0-0xe4bff123943bd647cbf435cddab0b1501b26ae4b',
                        symbol: 'DAI',
                    },
                ],
                tokensList: [
                    '0x475b5b1b668a221b703e42f095a48809a5cabddc',
                    '0xe4bff123943bd647cbf435cddab0b1501b26ae4b',
                ],
                totalWeight: '10',
            },
            {
                id: '0x6663f0293f692a9847dbff7b8f6f4f1a58648332',
                publicSwap: false,
                swapFee: '0.001',
                tokens: [],
                tokensList: [],
                totalWeight: '0',
            },
            {
                id: '0xda66697d3f0865e0bf66b8d2a655b58e19c4e371',
                publicSwap: true,
                swapFee: '0.001',
                tokens: [
                    {
                        address: '0x3e77f48620c299583e11667b3f560356c681bc72',
                        balance: '50',
                        decimals: 18,
                        denormWeight: '5',
                        id:
                            '0xda66697d3f0865e0bf66b8d2a655b58e19c4e371-0x3e77f48620c299583e11667b3f560356c681bc72',
                        symbol: 'WETH',
                    },
                    {
                        address: '0x858079cebf5f88eca7a46b582951c4464c13ec54',
                        balance: '20',
                        decimals: 18,
                        denormWeight: '5',
                        id:
                            '0xda66697d3f0865e0bf66b8d2a655b58e19c4e371-0x858079cebf5f88eca7a46b582951c4464c13ec54',
                        symbol: 'DAI',
                    },
                ],
                tokensList: [
                    '0x3e77f48620c299583e11667b3f560356c681bc72',
                    '0x858079cebf5f88eca7a46b582951c4464c13ec54',
                ],
                totalWeight: '10',
            },
        ],
        pools1000: [],
    },
};

// Returns all public pools
export async function getAllPublicSwapPools() {
    let pools = { pools: [] };
    try {
        pools = await getSubgraphPools();
        if (pools.pools.length === 0) {
            console.log(
                `[SubGraph] Load Error - No Pools Returned. Defaulting To Backup List.`
            );
            // pools.pools = allPools.pools;
        }
    } catch (error) {
        console.log(`[SubGraph] Load Error. Defaulting To Backup List.`);
        console.log(`[SubGraph] Error: ${error.message}`);
        // pools.pools = allPools.pools;
    }

    return pools;
}

async function getSubgraphPools() {
    const query = `
      {
          pools0: pools (first: 1000, where: {publicSwap: true, active: true}) {
            id
            swapFee
            totalWeight
            publicSwap
            tokens {
              id
              address
              balance
              decimals
              symbol
              denormWeight
            }
            tokensList
          },
          pools1000: pools (first: 1000, skip: 1000, where: {publicSwap: true, active: true}) {
            id
            swapFee
            totalWeight
            publicSwap
            tokens {
              id
              address
              balance
              decimals
              symbol
              denormWeight
            }
            tokensList
          }
      }
    `;

    // const response = await fetch(SUBGRAPH_URL, {
    //     method: 'POST',
    //     headers: {
    //         Accept: 'application/json',
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //         query,
    //     }),
    // });

    // const { data } = await response.json();

    const { data } = HARDCODED_POOLS;

    let pools = data.pools0.concat(data.pools1000);
    console.log(`[SubGraph] Number Of Pools: ${pools.length}`);
    return { pools: pools };
}
