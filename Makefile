# Windows MSYS2 Makefile
all: build_gui compile_cpp

build_gui:
	npm run build

compile_cpp:
	cd server && g++ main.cpp -o payvault.exe -O3 -std=c++17 -lws2_32

clean:
	cd server && del payvault.exe
