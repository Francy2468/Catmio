local Config = require("Settings")
local Pipeline = require("Pipe")

local IO = {}

-- // Banner \\ --
local function PrintBanner()
    print([[ Catmio Obfuscator v1.0.0
        https://discord.gg/SEyVaCzhYt
    ----------------------
    ]])
end

-- // Utils \\ --
local function ReadFile(path)
    local f = io.open(path, "r")
    if not f then return nil end
    local content = f:read("*a")
    f:close()
    return content
end

local function WriteFile(path, content)
    local f = io.open(path, "w")
    if not f then return false end
    f:write(content)
    f:close()
    return true
end

local function Input(prompt)
    io.write(prompt)
    return io.read()
end

local function Clear()
    os.execute("cls") -- change to "clear" if on linux
end

-- // Settings Menu \\ --
local function SettingsMenu()
    while true do
        print("\n  Settings")
        print("  --------")
        print("  1. Byte Shifting  [" .. tostring(Config.get("Byte_Shifting", "Enabled")) .. "]")
        print("  2. Junk Injection [" .. tostring(Config.get("Junk_Injection", "Enabled")) .. "] Amount: " .. tostring(Config.get("Junk_Injection", "Amount")))
        print("  3. Closure Wrap   [" .. tostring(Config.get("Closure_Wrap", "Enabled")) .. "]")
        print("  4. Back\n")

        local choice = Input("  Choice: ")

        if choice == "1" then
            local v = Input("  Byte Shifting Enabled (true/false): ")
            Config.set("Byte_Shifting", "Enabled", v == "true")
            print("  Updated!")

        elseif choice == "2" then
            local e = Input("  Junk Injection Enabled (true/false): ")
            local a = Input("  Junk Amount (number): ")
            Config.set("Junk_Injection", "Enabled", e == "true")
            Config.set("Junk_Injection", "Amount", tonumber(a) or 8)
            print("  Updated!")

        elseif choice == "3" then
            local v = Input("  Closure Wrap Enabled (true/false): ")
            Config.set("Closure_Wrap", "Enabled", v == "true")
            print("  Updated!")

        elseif choice == "4" then
            break

        else
            print("  Invalid choice.")
        end
    end
end

-- // Main Menu \\ --
local function MainMenu(inputPath, outputPath)
    while true do
        print("\n  Menu")
        print("  ----")
        print("  1. Start")
        print("  2. Settings")
        print("  3. Exit\n")

        local choice = Input("  Choice: ")

        if choice == "1" then
            print("\n  -----------------------")
            print("  Starting...")

            -- Read input
            print("  Viewing file: " .. inputPath)
            local source = ReadFile(inputPath)
            if not source then
                print("  Error: Could not read input file.")
            else
                print("  Viewed " .. #source .. " bytes")
                print("  Obfuscating....")

                -- Process
                local result = Pipeline.Process(source)

                if result then
                    print("  Obfuscated " .. #result .. " bytes")
                    print("  Output file: " .. outputPath)

                    -- Write output
                    local ok = WriteFile(outputPath, result)
                    if ok then
                        print("  Done!")
                    else
                        print("  Error: Could not write output file.")
                    end
                else
                    print("  Error: Obfuscation failed.")
                end
            end
            print("  -----------------------\n")

        elseif choice == "2" then
            SettingsMenu()

        elseif choice == "3" then
            print("\n  Goodbye!")
            break

        else
            print("  Invalid choice.")
        end
    end
end

-- // Entry Point \\ --
function IO.Run()
    Clear()
    PrintBanner()

    local inputPath = Input("  Input File: ")
    local outputPath = Input("  Output File: ")

    -- Create output file if it doesnt exist
    local f = io.open(outputPath, "r")
    if not f then
        WriteFile(outputPath, "")
        print("  Created output file: " .. outputPath)
    else
        f:close()
    end

    MainMenu(inputPath, outputPath)
end

return IO
