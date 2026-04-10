#include <iostream>
#include <fstream>
#include <string>
#include <vector>

// Define Windows compatibility macros for httplib
#ifdef _WIN32
#define WIN32_LEAN_AND_MEAN
#define _WIN32_WINNT 0x0A00
#include <windows.h>
#endif

#include "httplib.h"
#include "json.hpp"

using json = nlohmann::json;

// Core Models representing strict C++ OOP behavior
class Employee {
public:
    std::string id;
    std::string name;
    double basicPay;
    double otHours;

    Employee(std::string id, std::string name, double basicPay, double otHours)
        : id(id), name(name), basicPay(basicPay), otHours(otHours) {}
};

class AuthAccount {
public:
    std::string username;
    std::string password;
    std::string role;

    AuthAccount(std::string username, std::string password, std::string role)
        : username(username), password(password), role(role) {}
};

// Database Access Layer
json readDB() {
    std::ifstream file("database.json");
    if (!file.is_open()) {
        json defaultDB = {
            {"accounts", {{{"username", "admin"}, {"password", "password"}, {"role", "admin"}}}},
            {"employees", json::array()}
        };
        return defaultDB;
    }
    json result;
    try {
        file >> result;
    } catch (...) {
        result = {
            {"accounts", {{{"username", "admin"}, {"password", "password"}, {"role", "admin"}}}},
            {"employees", json::array()}
        };
    }
    return result;
}

void writeDB(const json& data) {
    std::ofstream file("database.json");
    if (file.is_open()) {
        file << data.dump(4);
    }
}

int main() {
    httplib::Server svr;

    // Append Global Headers for CORS support from React Dev Server if needed
    auto set_cors = [](httplib::Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*");
    };

    svr.Options(R"(.*)", [&set_cors](const httplib::Request&, httplib::Response& res) {
        set_cors(res);
        res.set_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type");
        res.status = 200;
    });

    // Accounts Controller
    svr.Get("/api/accounts", [&set_cors](const httplib::Request&, httplib::Response& res) {
        json db = readDB();
        set_cors(res);
        res.set_content(db["accounts"].dump(), "application/json");
    });

    svr.Post("/api/accounts", [&set_cors](const httplib::Request& req, httplib::Response& res) {
        try {
            json accounts = json::parse(req.body);
            json db = readDB();
            db["accounts"] = accounts;
            writeDB(db);
            set_cors(res);
            res.set_content(R"({"success":true})", "application/json");
        } catch (...) {
            set_cors(res);
            res.status = 400;
            res.set_content(R"({"success":false})", "application/json");
        }
    });

    // Employees Controller
    svr.Get("/api/employees", [&set_cors](const httplib::Request&, httplib::Response& res) {
        json db = readDB();
        set_cors(res);
        res.set_content(db["employees"].dump(), "application/json");
    });

    svr.Post("/api/employees", [&set_cors](const httplib::Request& req, httplib::Response& res) {
        try {
            json employees = json::parse(req.body);
            json db = readDB();
            db["employees"] = employees;
            writeDB(db);
            set_cors(res);
            res.set_content(R"({"success":true})", "application/json");
        } catch (...) {
            set_cors(res);
            res.status = 400;
            res.set_content(R"({"success":false})", "application/json");
        }
    });

    // Serve the Web GUI Static Build securely mapped to the Document Root
    // Users still get the visually stunning CSS / Particle backgrounds driven locally
    svr.set_mount_point("/", "../dist");

    // Initiate WebSockets binding natively
    int port = 3000;
    std::cout << "Native C++ Core starting optimally on port " << port << "..." << std::endl;
    // Launch server on standard HTTP binding block
    svr.listen("0.0.0.0", port);
    
    return 0;
}
