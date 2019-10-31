#pragma once

#include <eosio/eosio.hpp>
#include <eosio/time.hpp>
#include <eosio/system.hpp>

using namespace eosio;

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
            _hours( get_self(), get_self().value ),
            _days( get_self(), get_self().value ),
            _weeks( get_self(), get_self().value )
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

    using push_action = eosio::action_wrapper<"push"_n, &blocktivity::push>;

private:
    /**
     * ## TABLE `hours` & `days` & `weeks`
     *
     * - `{uint64_t} block_num` - block number start
     * - `{time_point_sec} timestamp` - Timestamp based on Block Number
     * - `{uint64_t} transactions` - number of actions during period
     * - `{uint64_t} actions` - number of transactions during period
     *
     * ### example
     *
     * ```json
     * {
     *   "block_num": 87458400,
     *   "timestamp": "2019-08-07T18:37:37",
     *   "transactions": 299282,
     *   "actions": 281802
     * }
     * ```
     */
    struct [[eosio::table("periods")]] periods_row {
        uint64_t                block_num;
        eosio::time_point_sec   timestamp;
        uint64_t                transactions;
        uint64_t                actions;

        uint64_t primary_key() const { return block_num; }
    };

    // Tables
    typedef eosio::multi_index< "hours"_n, periods_row> hours_table;
    typedef eosio::multi_index< "days"_n, periods_row> days_table;
    typedef eosio::multi_index< "weeks"_n, periods_row> weeks_table;

    // local instances of the multi indexes
    hours_table     _hours;
    days_table      _days;
    weeks_table     _weeks;
};