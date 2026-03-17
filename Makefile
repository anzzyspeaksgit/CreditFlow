.PHONY: install build test dev deploy help

help:
	@echo "CreditFlow Commands:"
	@echo "  make install    - Install contract and frontend dependencies"
	@echo "  make build      - Build contracts and frontend"
	@echo "  make test       - Run smart contract tests"
	@echo "  make dev        - Start frontend development server"
	@echo "  make deploy     - Deploy contracts to BNB testnet (Requires RPC_URL and PRIVATE_KEY in env)"

install:
	cd contracts && forge install
	cd frontend && npm install --legacy-peer-deps

build:
	cd contracts && forge build
	cd frontend && npm run build

test:
	cd contracts && forge test -vvv

dev:
	cd frontend && npm run dev

deploy:
	cd contracts && forge script script/Deploy.s.sol:DeployScript --rpc-url $${RPC_URL} --private-key $${PRIVATE_KEY} --broadcast
