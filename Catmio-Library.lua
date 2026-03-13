local Library = {}

local Players = game:GetService('Players')
local RunService = game:GetService('RunService')
local UserInputService = game:GetService('UserInputService')
local TweenService = game:GetService('TweenService')
local CoreGui = game:GetService('CoreGui')

local Mobile = if UserInputService.TouchEnabled and not UserInputService.KeyboardEnabled then true else false

local LocalPlayer = Players.LocalPlayer
local PlayerGui = LocalPlayer.PlayerGui

-- Color Principal: NARANJA
local MainColor = Color3.fromRGB(255, 128, 0)
local DarkOrange = Color3.fromRGB(200, 80, 0)

function Library:Parent()
    if not RunService:IsStudio() then
        return (gethui and gethui()) or CoreGui
    end
    return PlayerGui
end

function Library:Create(Class, Properties)
    local Creations = Instance.new(Class)
    for prop, value in Properties do
        Creations[prop] = value
    end
    return Creations
end

function Library:Draggable(a)
    local Dragging, DragInput, DragStart, StartPosition = nil, nil, nil, nil

    local function Update(input)
        local Delta = input.Position - DragStart
        local pos = UDim2.new(StartPosition.X.Scale, StartPosition.X.Offset + Delta.X, StartPosition.Y.Scale, StartPosition.Y.Offset + Delta.Y)
        TweenService:Create(a, TweenInfo.new(0.3), {Position = pos}):Play()
    end

    a.InputBegan:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch then
            Dragging = true
            DragStart = input.Position
            StartPosition = a.Position
            input.Changed:Connect(function()
                if input.UserInputState == Enum.UserInputState.End then
                    Dragging = false
                end
            end)
        end
    end)

    a.InputChanged:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseMovement or input.UserInputType == Enum.UserInputType.Touch then
            DragInput = input
        end
    end)

    UserInputService.InputChanged:Connect(function(input)
        if input == DragInput and Dragging then
            Update(input)
        end
    end)
end

function Library:Button(Parent): TextButton
    return Library:Create("TextButton", {
        Name = "Click",
        Parent = Parent,
        BackgroundColor3 = Color3.fromRGB(255, 255, 255),
        BackgroundTransparency = 1,
        BorderColor3 = Color3.fromRGB(0, 0, 0),
        BorderSizePixel = 0,
        Size = UDim2.new(1, 0, 1, 0),
        Font = Enum.Font.SourceSans,
        Text = "",
        TextColor3 = Color3.fromRGB(0, 0, 0),
        TextSize = 14,
        ZIndex = Parent.ZIndex + 3
    })
end

function Library:Tween(info)
    return TweenService:Create(info.v, TweenInfo.new(info.t, Enum.EasingStyle[info.s], Enum.EasingDirection[info.d]), info.g)
end

function Library.Effect(c, p)
    p.ClipsDescendants = true

    local Mouse = LocalPlayer:GetMouse()
    local relativeX = Mouse.X - c.AbsolutePosition.X
    local relativeY = Mouse.Y - c.AbsolutePosition.Y

    if relativeX < 0 or relativeY < 0 or relativeX > c.AbsoluteSize.X or relativeY > c.AbsoluteSize.Y then
        return
    end

    local ClickButtonCircle = Library:Create("Frame", {
        Parent = p,
        BackgroundColor3 = Color3.fromRGB(255, 255, 255),
        BackgroundTransparency = 0.75,
        BorderSizePixel = 0,
        AnchorPoint = Vector2.new(0.5, 0.5),
        Position = UDim2.new(0, relativeX, 0, relativeY),
        Size = UDim2.new(0, 0, 0, 0),
        ZIndex = p.ZIndex
    })

    Library:Create("UICorner", {
        Parent = ClickButtonCircle,
        CornerRadius = UDim.new(1, 0)
    })

    local expandTween = TweenService:Create(ClickButtonCircle, TweenInfo.new(2.5, Enum.EasingStyle.Back, Enum.EasingDirection.Out), {
        Size = UDim2.new(0, c.AbsoluteSize.X * 1.5, 0, c.AbsoluteSize.X * 1.5),
        BackgroundTransparency = 1
    })

    expandTween.Completed:Once(function()
        ClickButtonCircle:Destroy()
    end)

    expandTween:Play()
end

function Library:Asset(rbx)
    if typeof(rbx) == 'number' then
        return "rbxassetid://" .. rbx
    end
    if typeof(rbx) == 'string' and rbx:find('rbxassetid://') then
        return rbx
    end
    return rbx
end

function Library:NewRows(Parent, Title, Desciption)
    local Rows = Library:Create("Frame", {
        Name = "Rows",
        Parent = Parent,
        BackgroundColor3 = Color3.fromRGB(15, 15, 15),
        BorderColor3 = Color3.fromRGB(0, 0, 0),
        BorderSizePixel = 0,
        Size = UDim2.new(1, 0, 0, 40)
    })

    Library:Create("UIStroke", {
        Parent = Rows,
        Color = Color3.fromRGB(35, 35, 35), -- Un poco más visible para el naranja
        Thickness = 0.5
    })

    Library:Create("UICorner", {
        Parent = Rows,
        CornerRadius = UDim.new(0, 3)
    })

    Library:Create("UIListLayout", {
        Parent = Rows,
        Padding = UDim.new(0, 6),
        FillDirection = Enum.FillDirection.Horizontal,
        SortOrder = Enum.SortOrder.LayoutOrder,
        VerticalAlignment = Enum.VerticalAlignment.Center
    })

    Library:Create("UIPadding", {
        Parent = Rows,
        PaddingBottom = UDim.new(0, 6),
        PaddingTop = UDim.new(0, 5)
    })

    local Vectorize_1 = Library:Create("Frame", {
        Name = "Vectorize",
        Parent = Rows,
        BackgroundColor3 = Color3.fromRGB(255, 255, 255),
        BackgroundTransparency = 1,
        BorderColor3 = Color3.fromRGB(0, 0, 0),
        BorderSizePixel = 0,
        Size = UDim2.new(1, 0, 1, 0)
    })

    Library:Create("UIPadding", {
        Parent = Vectorize_1,
        PaddingLeft = UDim.new(0, 10),
        PaddingRight = UDim.new(0, 10)
    })

    local Right_1 = Library:Create("Frame", {
        Name = "Right",
        Parent = Vectorize_1,
        BackgroundColor3 = Color3.fromRGB(255, 255, 255),
        BackgroundTransparency = 1,
        BorderColor3 = Color3.fromRGB(0, 0, 0),
        BorderSizePixel = 0,
        Size = UDim2.new(1, 0, 1, 0)
    })

    Library:Create("UIListLayout", {
        Parent = Right_1,
        HorizontalAlignment = Enum.HorizontalAlignment.Right,
        SortOrder = Enum.SortOrder.LayoutOrder,
        VerticalAlignment = Enum.VerticalAlignment.Center
    })

    local Left_1 = Library:Create("Frame", {
        Name = "Left",
        Parent = Vectorize_1,
        BackgroundColor3 = Color3.fromRGB(255, 255, 255),
        BackgroundTransparency = 1,
        BorderColor3 = Color3.fromRGB(0, 0, 0),
        BorderSizePixel = 0,
        Size = UDim2.new(1, 0, 1, 0)
    })

    local Text_1 = Library:Create("Frame", {
        Name = "Text",
        Parent = Left_1,
        BackgroundColor3 = Color3.fromRGB(255, 255, 255),
        BackgroundTransparency = 1,
        BorderColor3 = Color3.fromRGB(0, 0, 0),
        BorderSizePixel = 0,
        Size = UDim2.new(1, 0, 1, 0)
    })

    Library:Create("UIListLayout", {
        Parent = Text_1,
        HorizontalAlignment = Enum.HorizontalAlignment.Center,
        SortOrder = Enum.SortOrder.LayoutOrder,
        VerticalAlignment = Enum.VerticalAlignment.Center
    })

    local TitleLabel = Library:Create("TextLabel", {
        Name = "Title",
        Parent = Text_1,
        AnchorPoint = Vector2.new(0.5, 0.5),
        BackgroundColor3 = Color3.fromRGB(255, 255, 255),
        BackgroundTransparency = 1,
        BorderColor3 = Color3.fromRGB(0, 0, 0),
        BorderSizePixel = 0,
        LayoutOrder = -1,
        Position = UDim2.new(0.5, 0, 0.5, 0),
        Size = UDim2.new(1, 0, 0, 13),
        Font = Enum.Font.GothamSemibold,
        RichText = true,
        Text = Title,
        TextColor3 = Color3.fromRGB(255, 255, 255),
        TextSize = 12,
        TextStrokeTransparency = 0.7,
        TextXAlignment = Enum.TextXAlignment.Left
    })

    Library:Create("UIGradient", {
        Parent = TitleLabel,
        Color = ColorSequence.new{
            ColorSequenceKeypoint.new(0, Color3.fromRGB(255, 255, 255)),
            ColorSequenceKeypoint.new(1, Color3.fromRGB(180, 180, 180))
        },
        Rotation = 90
    })

    Library:Create("TextLabel", {
        Name = "Desc",
        Parent = Text_1,
        AnchorPoint = Vector2.new(0.5, 0.5),
        BackgroundColor3 = Color3.fromRGB(255, 255, 255),
        BackgroundTransparency = 1,
        BorderColor3 = Color3.fromRGB(0, 0, 0),
        BorderSizePixel = 0,
        Position = UDim2.new(0.5, 0, 0.5, 0),
        Size = UDim2.new(1, 0, 0, 10),
        Font = Enum.Font.GothamMedium,
        RichText = true,
        Text = Desciption,
        TextColor3 = Color3.fromRGB(255, 255, 255),
        TextSize = 10,
        TextStrokeTransparency = 0.7,
        TextTransparency = 0.6,
        TextXAlignment = Enum.TextXAlignment.Left
    })

    return Rows
end

function Library:Window(Args)
    local Title = Args.Title or "Xova's Project"
    local SubTitle = Args.SubTitle or "Made by s1nve"

    local Xova = Library:Create("ScreenGui", {
        Name = "Xova",
        Parent = Library:Parent(),
        ZIndexBehavior = Enum.ZIndexBehavior.Global,
        IgnoreGuiInset = true
    })

    local Background_1 = Library:Create("Frame", {
        Name = "Background",
        Parent = Xova,
        AnchorPoint = Vector2.new(0.5, 0.5),
        BackgroundColor3 = Color3.fromRGB(11, 11, 11),
        BorderColor3 = Color3.fromRGB(0, 0, 0),
        BorderSizePixel = 0,
        Position = UDim2.new(0.5, 0, 0.5, 0),
        Size = UDim2.new(0, 500, 0, 350)
    })
    
    function Library:IsDropdownOpen()
        for _, v in pairs(Background_1:GetChildren()) do
            if v.Name == "Dropdown" and v.Visible then
                return true
            end
        end
    end

    Library:Create("UICorner", {
        Parent = Background_1
    })

    Library:Create("ImageLabel", {
        Name = "Shadow",
        Parent = Background_1,
        AnchorPoint = Vector2.new(0.5, 0.5),
        BackgroundColor3 = Color3.fromRGB(0, 0, 0),
        BackgroundTransparency = 1,
        BorderColor3 = Color3.fromRGB(0, 0, 0),
        BorderSizePixel = 0,
        Position = UDim2.new(0.5, 0, 0.5, 0),
        Size = UDim2.new(1, 120, 1, 120),
        ZIndex = 0,
        Image = "rbxassetid://8992230677",
        ImageColor3 = Color3.fromRGB(0, 0, 0),
        ImageTransparency = 0.5,
        ScaleType = Enum.ScaleType.Slice,
        SliceCenter = Rect.new(99, 99, 99, 99)
    })

    -- Header
    local Header_1 = Library:Create("Frame", {
        Name = "Header",
        Parent = Background_1,
        BackgroundColor3 = Color3.fromRGB(255, 255, 255),
        BackgroundTransparency = 1,
        BorderColor3 = Color3.fromRGB(0, 0, 0),
        BorderSizePixel = 0,
        Size = UDim2.new(1, 0, 0, 40)
    })

    -- Return button
    local Return_1 = Library:Create("ImageLabel", {
        Name = "Return",
        Parent = Header_1,
        AnchorPoint = Vector2.new(0.5, 0.5),
        BackgroundColor3 = Color3.fromRGB(255, 255, 255),
        BackgroundTransparency = 1,
        BorderColor3 = Color3.fromRGB(0, 0, 0),
        BorderSizePixel = 0,
        Position = UDim2.new(0, 25, 0.5, 1),
        Size = UDim2.new(0, 27, 0, 27),
        Image = "rbxassetid://130391877219356",
        ImageColor3 = MainColor,
        Visible = false
    })

    Library:Create("UIGradient", {
        Parent = Return_1,
        Rotation = 90,
        Color = ColorSequence.new{
            ColorSequenceKeypoint.new(0, Color3.fromRGB(255, 255, 255)),
            ColorSequenceKeypoint.new(1, Color3.fromRGB(56, 56, 56))
        },
    })

    -- HeadScale
    local HeadScale_1 = Library:Create("Frame", {
        Name = "HeadScale",
        Parent = Header_1,
        AnchorPoint = Vector2.new(1, 0),
        BackgroundColor3 = Color3.fromRGB(255, 255, 255),
        BackgroundTransparency = 1,
        BorderColor3 = Color3.fromRGB(0, 0, 0),
        BorderSizePixel = 0,
        Position = UDim2.new(1, 0, 0, 0),
        Size = UDim2.new(1, 0, 1, 0)
    })

    Library:Create("UIListLayout", {
        Parent = HeadScale_1,
        FillDirection = Enum.FillDirection.Horizontal,
        SortOrder = Enum.SortOrder.LayoutOrder,
        VerticalAlignment = Enum.VerticalAlignment.Center
    })

    Library:Create("UIPadding", {
        Parent = HeadScale_1,
        PaddingBottom = UDim.new(0, 15),
        PaddingLeft = UDim.new(0, 15),
        PaddingRight = UDim.new(0, 15),
        PaddingTop = UDim.new(0, 20)
    })

    -- Info (title + subtitle)
    local Info_1 = Library:Create("Frame", {
        Name = "Info",
        Parent = HeadScale_1,
        BackgroundColor3 = Color3.fromRGB(255, 255, 255),
        BackgroundTransparency = 1,
        BorderColor3 = Color3.fromRGB(0, 0, 0),
        BorderSizePixel = 0,
        Size = UDim2.new(1, -100, 0, 28)
    })

    Library:Create("UIListLayout", {
        Parent = Info_1,
        HorizontalAlignment = Enum.HorizontalAlignment.Center,
        SortOrder = Enum.SortOrder.LayoutOrder
    })

    local Title_1 = Library:Create("TextLabel", {
        Name = "Title",
        Parent = Info_1,
        AnchorPoint = Vector2.new(0.5, 0.5),
        BackgroundColor3 = Color3.fromRGB(255, 255, 255),
        BackgroundTransparency = 1,
        BorderColor3 = Color3.fromRGB(0, 0, 0),
        BorderSizePixel = 0,
        Position = UDim2.new(0.5, 0, 0.5, 0),
        Size = UDim2.new(1, 0, 0, 14),
        Font = Enum.Font.GothamBold,
        RichText = true,
        Text = Title,
        TextColor3 = MainColor,
        TextSize = 14,
        TextStrokeTransparency = 0.7,
        TextXAlignment = Enum.TextXAlignment.Left
    })

    Library:Create("UIGradient", {
        Parent = Title_1,
        Color = ColorSequence.new{
            ColorSequenceKeypoint.new(0, Color3.fromRGB(255, 255, 255)),
            ColorSequenceKeypoint.new(1, Color3.fromRGB(150, 150, 150))
        },
        Rotation = 90
    })

    Library:Create("TextLabel", {
        Name = "SubTitle",
        Parent = Info_1,
        AnchorPoint = Vector2.new(0.5, 0.5),
        BackgroundColor3 = Color3.fromRGB(255, 255, 255),
        BackgroundTransparency = 1,
        BorderColor3 = Color3.fromRGB(0, 0, 0),
        BorderSizePixel = 0,
        Position = UDim2.new(0.5, 0, 0.5, 0),
        Size = UDim2.new(1, 0, 0, 10),
        Font = Enum.Font.GothamMedium,
        RichText = true,
        Text = SubTitle,
        TextColor3 = Color3.fromRGB(255, 255, 255),
        TextSize = 10,
        TextStrokeTransparency = 0.7,
        TextTransparency = 0.6,
        TextXAlignment = Enum.TextXAlignment.Left
    })

    -- Expires
    local Expires_1 = Library:Create("Frame", {
        Name = "Expires",
        Parent = HeadScale_1,
        BackgroundColor3 = Color3.fromRGB(255, 255, 255),
        BackgroundTransparency = 1,
        BorderColor3 = Color3.fromRGB(0, 0, 0),
        BorderSizePixel = 0,
        Position = UDim2.new(0.787233949, 0, -3.5, 0),
        Size = UDim2.new(0, 100, 0, 40)
    })

    Library:Create("UIListLayout", {
        Parent = Expires_1,
        Padding = UDim.new(0, 10),
        FillDirection = Enum.FillDirection.Horizontal,
        HorizontalAlignment = Enum.HorizontalAlignment.Right,
        SortOrder = Enum.SortOrder.LayoutOrder,
        VerticalAlignment = Enum.VerticalAlignment.Center
    })

    local Asset_1 = Library:Create("ImageLabel", {
        Name = "Asset",
        Parent = Expires_1,
        BackgroundColor3 = Color3.fromRGB(255, 255, 255),
        BackgroundTransparency = 1,
        BorderColor3 = Color3.fromRGB(0, 0, 0),
        BorderSizePixel = 0,
        Size = UDim2.new(0, 20, 0, 20),
        Image = "rbxassetid://100865348188048",
        ImageColor3 = MainColor,
        LayoutOrder = 1
    })

    Library:Create("UIGradient", {
        Parent = Asset_1,
        Color = ColorSequence.new{
            ColorSequenceKeypoint.new(0, Color3.fromRGB(255, 255, 255)),
            ColorSequenceKeypoint.new(1, Color3.fromRGB(150, 150, 150))
        },
        Rotation = 90
    })

    -- Info_2 (expires title + time)
    local Info_2 = Library:Create("Frame", {
        Name = "Info",
        Parent = Expires_1,
        AnchorPoint = Vector2.new(0.5, 0.5),
        BackgroundColor3 = Color3.fromRGB(255, 255, 255),
        BackgroundTransparency = 1,
        BorderColor3 = Color3.fromRGB(0, 0, 0),
        BorderSizePixel = 0,
        Position = UDim2.new(0.5, 0, 0.5, 0),
        Size = UDim2.new(1, 0, 0, 28)
    })

    Library:Create("UIListLayout", {
        Parent = Info_2,
        HorizontalAlignment = Enum.HorizontalAlignment.Center,
        SortOrder = Enum.SortOrder.LayoutOrder
    })

    local Title_2 = Library:Create("TextLabel", {
        Name = "Title",
        Parent = Info_2,
        AnchorPoint = Vector2.new(0.5, 0.5),
        BackgroundColor3 = Color3.fromRGB(255, 255, 255),
        BackgroundTransparency = 1,
        BorderColor3 = Color3.fromRGB(0, 0, 0),
        BorderSizePixel = 0,
        Position = UDim2.new(0.5, 0, 0.5, 0),
        Size = UDim2.new(1, 0, 0, 14),
        Font = Enum.Font.GothamSemibold,
        RichText = true,
        Text = "Expires at",
        TextColor3 = MainColor,
        TextSize = 13,
        TextStrokeTransparency = 0.7,
        TextXAlignment = Enum.TextXAlignment.Right
    })

    Library:Create("UIGradient", {
        Parent = Title_2,
        Color = ColorSequence.new{
            ColorSequenceKeypoint.new(0, Color3.fromRGB(255, 255, 255)),
            ColorSequenceKeypoint.new(1, Color3.fromRGB(150, 150, 150))
        },
        Rotation = 90
    })

    local THETIME = Library:Create("TextLabel", {
        Name = "Time",
        Parent = Info_2,
        AnchorPoint = Vector2.new(0.5, 0.5),
        BackgroundColor3 = Color3.fromRGB(255, 255, 255),
        BackgroundTransparency = 1,
        BorderColor3 = Color3.fromRGB(0, 0, 0),
        BorderSizePixel = 0,
        Position = UDim2.new(0.5, 0, 0.5, 0),
        Size = UDim2.new(1, 0, 0, 10),
        Font = Enum.Font.GothamMedium,
        RichText = true,
        Text = "00:00:00 Hours",
        TextColor3 = Color3.fromRGB(255, 255, 255),
        TextSize = 10,
        TextStrokeTransparency = 0.7,
        TextTransparency = 0.6,
        TextXAlignment = Enum.TextXAlignment.Right
    })
    
    -- Body
    local Scale_1 = Library:Create("Frame", {
        Name = "Scale",
        Parent = Background_1,
        AnchorPoint = Vector2.new(0, 1),
        BackgroundColor3 = Color3.fromRGB(255, 255, 255),
        BackgroundTransparency = 1,
        BorderColor3 = Color3.fromRGB(0, 0, 0),
        BorderSizePixel = 0,
        Position = UDim2.new(0, 0, 1, 0),
        Size = UDim2.new(1, 0, 1, -40)
    })

    local Home_1 = Library:Create("Frame", {
        Name = "Home",
        Parent = Scale_1,
        BackgroundColor3 = Color3.fromRGB(255, 255, 255),
        BackgroundTransparency = 1,
        BorderColor3 = Color3.fromRGB(0, 0, 0),
        BorderSizePixel = 0,
        Size = UDim2.new(1, 0, 1, 0)
    })

    Library:Create("UIPadding", {
        Parent = Home_1,
        PaddingBottom = UDim.new(0, 15),
        PaddingLeft = UDim.new(0, 14),
        PaddingRight = UDim.new(0, 14)
    })

    local MainTabsScrolling = Library:Create("ScrollingFrame", {
        Name = "ScrollingFrame",
        Parent = Home_1,
        Active = true,
        BackgroundColor3 = Color3.fromRGB(255, 255, 255),
        BackgroundTransparency = 1,
        BorderColor3 = Color3.fromRGB(0, 0, 0),
        BorderSizePixel = 0,
        Size = UDim2.new(1, 0, 1, 0),
        ClipsDescendants = true,
        ScrollBarThickness = 0,
        ScrollingDirection = Enum.ScrollingDirection.XY,
    })

    local UIListLayout_1 = Library:Create("UIListLayout", {
        Parent = MainTabsScrolling,
        Padding = UDim.new(0, 10),
        FillDirection = Enum.FillDirection.Horizontal,
        SortOrder = Enum.SortOrder.LayoutOrder,
        Wraps = true
    })

    UIListLayout_1:GetPropertyChangedSignal("AbsoluteContentSize"):Connect(function()
        MainTabsScrolling.CanvasSize = UDim2.new(0, 0, 0, UIListLayout_1.AbsoluteContentSize.Y + 15)
    end)

    local PageService: UIPageLayout = Library:Create("UIPageLayout", {
        Parent = Scale_1
    })

    local Window = {}

    function Window:NewPage(Args)
        local Title = Args.Title or "Unknow"
        local Desc = Args.Desc or "Description"
        local Icon = Args.Icon or 127194456372995

        local NewTabs = Library:Create("Frame", {
            Name = "NewTabs",
            Parent = MainTabsScrolling,
            BackgroundColor3 = Color3.fromRGB(10, 10, 10),
            BorderColor3 = Color3.fromRGB(0, 0, 0),
            BorderSizePixel = 0,
            Size = UDim2.new(0, 230, 0, 55)
        })

        local Click = Library:Button(NewTabs)

        Library:Create("UICorner", {
            Parent = NewTabs,
            CornerRadius = UDim.new(0, 5)
        })

        Library:Create("UIStroke", {
            Parent = NewTabs,
            Color = MainColor,
            Thickness = 1,
            Transparency = 0.5
        })

        local Banner_1 = Library:Create("ImageLabel", {
            Name = "Banner",
            Parent = NewTabs,
            BackgroundColor3 = Color3.fromRGB(255, 255, 255),
            BackgroundTransparency = 1,
            BorderColor3 = Color3.fromRGB(0, 0, 0),
            BorderSizePixel = 0,
            Size = UDim2.new(1, 0, 1, 0),
            Image = "rbxassetid://125411502674016",
            ImageColor3 = MainColor,
            ScaleType = Enum.ScaleType.Crop
        })

        Library:Create("UICorner", {
            Parent = Banner_1,
            CornerRadius = UDim.new(0, 2)
        })

        local Info_1 = Library:Create("Frame", {
            Name = "Info",
            Parent = NewTabs,
            BackgroundColor3 = Color3.fromRGB(255, 255, 255),
            BackgroundTransparency = 1,
            BorderColor3 = Color3.fromRGB(0, 0, 0),
            BorderSizePixel = 0,
            Size = UDim2.new(1, 0, 1, 0)
        })

        Library:Create("UIListLayout", {
            Parent = Info_1,
            Padding = UDim.new(0, 10),
            FillDirection = Enum.FillDirection.Horizontal,
            SortOrder = Enum.SortOrder.LayoutOrder,
            VerticalAlignment = Enum.VerticalAlignment.Center
        })

        Library:Create("UIPadding", {
            Parent = Info_1,
            PaddingLeft = UDim.new(0, 15)
        })

        local Icon_1 = Library:Create("ImageLabel", {
            Name = "Icon",
            Parent = Info_1,
            BackgroundColor3 = Color3.fromRGB(255, 255, 255),
            BackgroundTransparency = 1,
            BorderColor3 = Color3.fromRGB(0, 0, 0),
            BorderSizePixel = 0,
            LayoutOrder = -1,
            Size = UDim2.new(0, 25, 0, 25),
            Image = Library:Asset(Icon),
            ImageColor3 = MainColor
        })

        Library:Create("UIGradient", {
            Parent = Icon_1,
            Color = ColorSequence.new{
                ColorSequenceKeypoint.new(0, Color3.fromRGB(255, 255, 255)),
                ColorSequenceKeypoint.new(1, Color3.fromRGB(150, 150, 150))
            },
            Rotation = 90
        })

        local Text_1 = Library:Create("Frame", {
            Name = "Text",
            Parent = Info_1,
            BackgroundColor3 = Color3.fromRGB(255, 255, 255),
            BackgroundTransparency = 1,
            BorderColor3 = Color3.fromRGB(0, 0, 0),
            BorderSizePixel = 0,
            Size = UDim2.new(0, 150, 0, 32)
        })

        Library:Create("UIListLayout", {
            Parent = Text_1,
            Padding = UDim.new(0, 2),
            SortOrder = Enum.SortOrder.LayoutOrder,
            VerticalAlignment = Enum.VerticalAlignment.Center
        })

        local TabTitle = Library:Create("TextLabel", {
            Name = "Title",
            Parent = Text_1,
            BackgroundColor3 = Color3.fromRGB(255, 255, 255),
            BackgroundTransparency = 1,
            Size = UDim2.new(0, 150, 0, 14),
            Font = Enum.Font.GothamBold,
            RichText = true,
            Text = Title,
            TextColor3 = MainColor,
            TextSize = 15,
            TextStrokeTransparency = 0.5,
            TextXAlignment = Enum.TextXAlignment.Left
        })

        Library:Create("UIGradient", {
            Parent = TabTitle,
            Color = ColorSequence.new{
                ColorSequenceKeypoint.new(0, Color3.fromRGB(255, 255, 255)),
                ColorSequenceKeypoint.new(1, Color3.fromRGB(150, 150, 150))
            },
            Rotation = 90
        })

        Library:Create("TextLabel", {
            Name = "Desc",
            Parent = Text_1,
            BackgroundColor3 = Color3.fromRGB(255, 255, 255),
            BackgroundTransparency = 1,
            Size = UDim2.new(0.9, 0, 0, 10),
            Font = Enum.Font.GothamMedium,
            RichText = true,
            Text = Desc,
            TextColor3 = Color3.fromRGB(255, 255, 255),
            TextSize = 10,
            TextStrokeTransparency = 0.5,
            TextTransparency = 0.2,
            TextXAlignment = Enum.TextXAlignment.Left
        })

        local NewPage = Library:Create("Frame", {
            Name = "NewPage",
            Parent = Scale_1,
            BackgroundColor3 = Color3.fromRGB(255, 255, 255),
            BackgroundTransparency = 1,
            Size = UDim2.new(1, 0, 1, 0)
        })

        local PageScrolling_1 = Library:Create("ScrollingFrame", {
            Name = "PageScrolling",
            Parent = NewPage,
            Active = true,
            BackgroundColor3 = Color3.fromRGB(255, 255, 255),
            BackgroundTransparency = 1,
            BorderSizePixel = 0,
            Size = UDim2.new(1, 0, 1, 0),
            ScrollBarThickness = 0,
            ScrollingDirection = Enum.ScrollingDirection.XY,
        })

        Library:Create("UIPadding", {
            Parent = PageScrolling_1,
            PaddingBottom = UDim.new(0, 1),
            PaddingLeft = UDim.new(0, 15),
            PaddingRight = UDim.new(0, 15),
            PaddingTop = UDim.new(0, 1)
        })

        local UIListLayout_2 = Library:Create("UIListLayout", {
            Parent = PageScrolling_1,
            Padding = UDim.new(0, 5),
            SortOrder = Enum.SortOrder.LayoutOrder
        })

        UIListLayout_2:GetPropertyChangedSignal("AbsoluteContentSize"):Connect(function()
            PageScrolling_1.CanvasSize = UDim2.new(0, 0, 0, UIListLayout_2.AbsoluteContentSize.Y + 15)
        end)

        local function OnChangPage()
            Library:Tween({
                v = HeadScale_1,
                t = 0.2,
                s = "Exponential",
                d = "Out",
                g = { Size = UDim2.new(1, -30, 1, 0) }
            }):Play()
            Return_1.Visible = true
            PageService:JumpTo(NewPage)
        end

        local Page = {}

        function Page:Section(Text)
            local SectionTitle = Library:Create("TextLabel", {
                Name = "Title",
                Parent = PageScrolling_1,
                BackgroundColor3 = Color3.fromRGB(255, 255, 255),
                BackgroundTransparency = 1,
                Size = UDim2.new(1, 0, 0, 20),
                Font = Enum.Font.GothamBold,
                RichText = true,
                Text = " " .. Text,
                TextColor3 = Color3.fromRGB(255, 255, 255),
                TextSize = 15,
                TextStrokeTransparency = 0.7,
                TextXAlignment = Enum.TextXAlignment.Left
            })
            Library:Create("UIGradient", {
                Parent = SectionTitle,
                Color = ColorSequence.new{
                    ColorSequenceKeypoint.new(0, Color3.fromRGB(255, 255, 255)),
                    ColorSequenceKeypoint.new(1, Color3.fromRGB(150, 150, 150))
                },
                Rotation = 90
            })
            return SectionTitle
        end

        function Page:Button(Args)
            local Title = Args.Title
            local Desc = Args.Desc
            local Text = Args.Text or "Click"
            local Callback = Args.Callback

            local Rows = Library:NewRows(PageScrolling_1, Title, Desc)
            local Right = Rows.Vectorize.Right

            local Button = Library:Create("Frame", {
                Name = "Button",
                Parent = Right,
                BackgroundColor3 = MainColor,
                BorderSizePixel = 0,
                Size = UDim2.new(0, 75, 0, 25)
            })

            Library:Create("UICorner", {
                Parent = Button,
                CornerRadius = UDim.new(0, 3)
            })

            Library:Create("UIGradient", {
                Parent = Button,
                Color = ColorSequence.new{
                    ColorSequenceKeypoint.new(0, Color3.fromRGB(255, 255, 255)),
                    ColorSequenceKeypoint.new(1, Color3.fromRGB(100, 100, 100))
                },
                Rotation = 90
            })

            local TextLabel = Library:Create("TextLabel", {
                Parent = Button,
                Size = UDim2.new(1, 0, 1, 0),
                Font = Enum.Font.GothamSemibold,
                Text = Text,
                TextColor3 = Color3.fromRGB(255, 255, 255),
                TextSize = 11,
                BackgroundTransparency = 1,
                TextStrokeTransparency = 0.7
            })

            Button.Size = UDim2.new(0, TextLabel.TextBounds.X + 40, 0, 25)

            local Click = Library:Button(Button)
            Click.MouseButton1Click:Connect(function()
                if Library:IsDropdownOpen() then return end
                task.spawn(Library.Effect, Click, Button)
                if Callback then Callback() end
            end)

            return Click
        end

        function Page:Toggle(Args)
            local Title = Args.Title
            local Desc = Args.Desc
            local Value = Args.Value or false
            local Callback = Args.Callback or function() end

            local Rows = Library:NewRows(PageScrolling_1, Title, Desc)
            local Right = Rows.Vectorize.Right
            local TitleLabelRow = Rows.Vectorize.Left.Text.Title

            local Background = Library:Create("Frame", {
                Parent = Right,
                BackgroundColor3 = Color3.fromRGB(10, 10, 10),
                Size = UDim2.new(0, 20, 0, 20)
            })
            
            local UIStroke = Library:Create("UIStroke", {
                Parent = Background,
                Color = Color3.fromRGB(40, 40, 40),
                Thickness = 0.5
            })

            Library:Create("UICorner", { Parent = Background, CornerRadius = UDim.new(0, 5) })

            local Highligh = Library:Create("Frame", {
                Parent = Background,
                AnchorPoint = Vector2.new(0.5, 0.5),
                BackgroundColor3 = MainColor,
                Position = UDim2.new(0.5, 0, 0.5, 0),
                Size = UDim2.new(0, 20, 0, 20)
            })

            Library:Create("UICorner", { Parent = Highligh, CornerRadius = UDim.new(0, 5) })

            Library:Create("UIGradient", {
                Parent = Highligh,
                Color = ColorSequence.new{
                    ColorSequenceKeypoint.new(0, Color3.fromRGB(255, 255, 255)),
                    ColorSequenceKeypoint.new(1, Color3.fromRGB(100, 100, 100))
                },
                Rotation = 90
            })

            local IconTick = Library:Create("ImageLabel", {
                Parent = Highligh,
                AnchorPoint = Vector2.new(0.5, 0.5),
                BackgroundTransparency = 1,
                Position = UDim2.new(0.5, 0, 0.5, 0),
                Size = UDim2.new(0.45, 0, 0.45, 0),
                Image = "rbxassetid://86682186031062"
            })

            local Click = Library:Button(Background)
            local toggleValue = Value

            local function Update(val)
                if val then
                    TitleLabelRow.TextColor3 = MainColor
                    Library:Tween({ v = Highligh, t = 0.3, s = "Exponential", d = "Out", g = { BackgroundTransparency = 0 } }):Play()
                    Library:Tween({ v = IconTick, t = 0.3, s = "Exponential", d = "Out", g = { ImageTransparency = 0 } }):Play()
                    UIStroke.Thickness = 0
                else
                    TitleLabelRow.TextColor3 = Color3.fromRGB(255, 255, 255)
                    Library:Tween({ v = Highligh, t = 0.3, s = "Exponential", d = "Out", g = { BackgroundTransparency = 1 } }):Play()
                    Library:Tween({ v = IconTick, t = 0.3, s = "Exponential", d = "Out", g = { ImageTransparency = 1 } }):Play()
                    UIStroke.Thickness = 0.5
                end
            end

            Click.MouseButton1Click:Connect(function()
                if Library:IsDropdownOpen() then return end
                toggleValue = not toggleValue
                Update(toggleValue)
                Callback(toggleValue)
            end)
            
            Update(toggleValue)
            return { Value = toggleValue }
        end

        function Page:Slider(Args)
            local Title = Args.Title
            local Min = Args.Min
            local Max = Args.Max
            local Rounding = Args.Rounding or 0
            local Value = Args.Value or Min
            local Callback = Args.Callback or function() end

            local Slider_1 = Library:Create("Frame", {
                Parent = PageScrolling_1,
                BackgroundColor3 = Color3.fromRGB(15, 15, 15),
                Size = UDim2.new(1, 0, 0, 42)
            })

            Library:Create("UICorner", { Parent = Slider_1, CornerRadius = UDim.new(0, 3) })
            Library:Create("UIStroke", { Parent = Slider_1, Color = Color3.fromRGB(40, 40, 40), Thickness = 0.5 })
            Library:Create("UIPadding", { Parent = Slider_1, PaddingLeft = UDim.new(0, 10), PaddingRight = UDim.new(0, 10) })

            local Title_1 = Library:Create("TextLabel", {
                Parent = Slider_1,
                Size = UDim2.new(1, 0, 0, 20),
                Font = Enum.Font.GothamSemibold,
                Text = Title,
                TextColor3 = Color3.fromRGB(255, 255, 255),
                TextSize = 12,
                BackgroundTransparency = 1,
                TextXAlignment = Enum.TextXAlignment.Left
            })

            local ColorBar_1 = Library:Create("Frame", {
                Parent = Slider_1,
                AnchorPoint = Vector2.new(0, 1),
                BackgroundColor3 = Color3.fromRGB(10, 10, 10),
                Position = UDim2.new(0, 0, 1, -8),
                Size = UDim2.new(1, 0, 0, 5)
            })

            local ColorBar_2 = Library:Create("Frame", {
                Parent = ColorBar_1,
                BackgroundColor3 = MainColor,
                Size = UDim2.new(0, 0, 1, 0)
            })

            Library:Create("UICorner", { Parent = ColorBar_2, CornerRadius = UDim.new(0, 3) })
            Library:Create("UIGradient", {
                Parent = ColorBar_2,
                Color = ColorSequence.new{
                    ColorSequenceKeypoint.new(0, Color3.fromRGB(255, 255, 255)),
                    ColorSequenceKeypoint.new(1, Color3.fromRGB(100, 100, 100))
                },
                Rotation = 90
            })

            local Boxvalue_1 = Library:Create("TextBox", {
                Parent = Slider_1,
                AnchorPoint = Vector2.new(1, 0),
                BackgroundTransparency = 1,
                Position = UDim2.new(1, -5, 0, 5),
                Size = UDim2.new(0, 60, 0, 15),
                Font = Enum.Font.GothamMedium,
                Text = tostring(Value),
                TextColor3 = Color3.fromRGB(255, 255, 255),
                TextSize = 11,
                TextXAlignment = Enum.TextXAlignment.Right
            })

            local function UpdateSlider(val)
                val = math.clamp(val, Min, Max)
                val = math.floor(val * (10 ^ Rounding) + 0.5) / (10 ^ Rounding)
                local ratio = (val - Min) / (Max - Min)
                ColorBar_2.Size = UDim2.new(ratio, 0, 1, 0)
                Boxvalue_1.Text = tostring(val)
                Callback(val)
            end

            local dragging = false
            Slider_1.InputBegan:Connect(function(input)
                if input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch then
                    dragging = true
                end
            end)

            UserInputService.InputEnded:Connect(function(input)
                if input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch then
                    dragging = false
                end
            end)

            UserInputService.InputChanged:Connect(function(input)
                if dragging and (input.UserInputType == Enum.UserInputType.MouseMovement or input.UserInputType == Enum.UserInputType.Touch) then
                    local absX = ColorBar_1.AbsolutePosition.X
                    local absW = ColorBar_1.AbsoluteSize.X
                    local ratio = math.clamp((input.Position.X - absX) / absW, 0, 1)
                    UpdateSlider(ratio * (Max - Min) + Min)
                end
            end)

            UpdateSlider(Value)
        end

        Click.MouseButton1Click:Connect(OnChangPage)
        return Page
    end

    -- Inicialización Final
    do
        PageService:JumpTo(Home_1)
        Library:Draggable(Background_1)
        
        local Return_Button = Library:Button(Return_1)
        Return_Button.MouseButton1Click:Connect(function()
            Return_1.Visible = false
            Library:Tween({ v = HeadScale_1, t = 0.3, s = "Exponential", d = "Out", g = { Size = UDim2.new(1, 0, 1, 0) } }):Play()
            PageService:JumpTo(Home_1)
        end)
        
        -- Toggle GUI
        local ToggleScreen = Library:Create("ScreenGui", { Parent = Library:Parent() })
        local Pillow = Library:Create("TextButton", {
            Parent = ToggleScreen,
            BackgroundColor3 = Color3.fromRGB(11, 11, 11),
            Position = UDim2.new(0.06, 0, 0.15, 0),
            Size = UDim2.new(0, 50, 0, 50),
            Text = ""
        })
        Library:Create("UICorner", { Parent = Pillow, CornerRadius = UDim.new(1, 0) })
        Library:Create("UIStroke", { Parent = Pillow, Color = MainColor, Thickness = 2 })
        
        Library:Create("ImageLabel", {
            Parent = Pillow,
            AnchorPoint = Vector2.new(0.5, 0.5),
            BackgroundTransparency = 1,
            Position = UDim2.new(0.5, 0, 0.5, 0),
            Size = UDim2.new(0.6, 0, 0.6, 0),
            Image = "rbxassetid://104055321996495",
            ImageColor3 = MainColor
        })
        
        Library:Draggable(Pillow)
        Pillow.MouseButton1Click:Connect(function()
            Background_1.Visible = not Background_1.Visible
        end)
    end

    return Window
end

return Library
