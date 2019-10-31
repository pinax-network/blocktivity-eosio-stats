#!/usr/bin/env bash

mkdir -p dist

GREEN='\033[0;32m'
NC='\033[0m'
echo -e "${GREEN}Compiling blocktivity...${NC}"

# blocktivity
eosio-cpp -abigen \
  contracts/blocktivity/src/blocktivity.cpp \
  -contract blocktivity \
  -R contracts/blocktivity/resource \
  -o ./dist/blocktivity.wasm \
  -I contracts/blocktivity/include
