#pragma once

#include <eosio/eosio.hpp>
#include <eosio/time.hpp>
#include <eosio/singleton.hpp>
#include <eosio/system.hpp>

using namespace eosio;
using namespace std;

const uint64_t ONE_HOUR = 7200;

class [[eosio::contract("blocktivity")]] blocktivity : public contract {
public:
    using contract::contract;

    /**
     * Construct a new contract given the contract name
     *
     * @param {name} receiver - The name of this contract
     * @param {name} code - The code name of the action this contract is processing.
     * @param {datastream} ds - The datastream used
     */
    blocktivity( name receiver, name code, eosio::datastream<const char*> ds )
        : contract( receiver, code, ds ),
            _periods( get_self(), get_self().value ),
            _sum( get_self(), get_self().value )
    {}

    /**
     * ## ACTION `push`
     *
     * Pushes hourly (7200 blocks) statistics of transaction & action counts.
     *
     * - Authority:  `get_self()`
     *
     * ### params
     *
     * - `{uint64_t} block_num` - block number start (rounded to the nearest 7200 interval)
     * - `{uint64_t} transactions` - number of actions during 1 hour period
     * - `{uint64_t} actions` - number of transactions during 1 hour period
     *
     * ### example
     *
     * ```bash
     * cleos push action blocktivity push '[87458400, 299282, 281802]' -p blocktivity
     * ```
     */
    [[eosio::action]]
    void push( const uint64_t block_num, const uint64_t transactions, const uint64_t actions );

    [[eosio::action]]
    void clean( const eosio::name table, const std::optional<eosio::name> scope );

    using push_action = eosio::action_wrapper<"push"_n, &blocktivity::push>;

private:
    /**
     * ## TABLE `periods`
     *
     * - `{uint64_t} block_num` - start of block number
     * - `{uint64_t} transactions` - number of actions during 1 hour period
     * - `{uint64_t} actions` - number of transactions during 1 hour period
     *
     * ### example
     *
     * ```json
     * {
     *   "block_num": 87458400,
     *   "transactions": 299282,
     *   "actions": 281802
     * }
     * ```
     */
    struct [[eosio::table("periods")]] periods_row {
        uint64_t                block_num;
        uint64_t                transactions;
        uint64_t                actions;

        uint64_t primary_key() const { return block_num * -1; }
    };

    /**
     * ## TABLE `sum`
     *
     * - `{uint64_t} hour` - hourly number of actions
     * - `{uint64_t} day` - daily number of actions
     * - `{uint64_t} week` - weekly number of actions
     * - `{time_point_sec} timestamp` - last updated
     *
     * ### example
     *
     * ```json
     * {
     *   "hour": 875365,
     *   "day": 20773084,
     *   "week": 83237200,
     *   "timestamp": "2019-11-03T16:48:21"
     * }
     * ```
     */
    struct [[eosio::table("sum")]] sum_row {
        uint64_t                hour = 0;
        uint64_t                day = 0;
        uint64_t                week = 0;
        eosio::time_point_sec   timestamp;
    };

    // Tables
    typedef eosio::multi_index< "periods"_n, periods_row> periods_table;
    typedef eosio::singleton< "sum"_n, sum_row> sum_table;

    // local instances of the multi indexes
    periods_table       _periods;
    sum_table           _sum;

    // private helpers
    void add_hour( const uint64_t block_num, const uint64_t transactions, const uint64_t actions );
    void calculate_periods();
};