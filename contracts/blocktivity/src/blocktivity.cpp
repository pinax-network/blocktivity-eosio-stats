#include "blocktivity.hpp"

void blocktivity::push( const uint64_t block_num, const uint64_t transactions, const uint64_t actions )
{
    require_auth( get_self() );

    add_hour( block_num, transactions, actions );
    calculate_periods();
}

void blocktivity::add_hour( const uint64_t block_num, const uint64_t transactions, const uint64_t actions )
{
    check( block_num % INTERVAL == 0, "[block_num] must be a modulo of " + to_string(INTERVAL));

    _periods.emplace( get_self(), [&]( auto& row ) {
        row.block_num = block_num;
        row.timestamp = current_time_point();
        row.transactions = transactions;
        row.actions = actions;
    });
}

void blocktivity::calculate_periods()
{
    // counters
    auto sum = _sum.get_or_default();
    uint64_t actions = 0;
    int count = 0;

    // iterate over each 1 hour period
    auto itr = _periods.begin();
    while ( itr != _periods.end() ) {
        // sum actions
        actions += itr->actions;
        count += 1;

        // update hour/day/week stats
        if (count == 1) sum.hour = actions;
        if (count == 24) sum.day = actions;
        if (count == 168) sum.week = actions;

        // erase any hour periods that exceed 1 week
        if ( count > 168 ) itr = _periods.erase( itr );
        if ( itr != _periods.end()) itr++;
    }
    // save stats
    _sum.set( sum, get_self() );
}

void blocktivity::clean( const eosio::name table, const std::optional<eosio::name> scope )
{
    require_auth( get_self() );

    // periods
    if (table == "periods"_n) {
        auto periods_itr = _periods.begin();
        while ( periods_itr != _periods.end() ) {
            periods_itr = _periods.erase(periods_itr);
        }
    }
    else if (table == "sum"_n) _sum.remove();
}