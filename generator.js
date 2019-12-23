var isCharacterInGroup = false

function generate() 
{
    fillTemplate(pickRandomFromList(getCategoryOptionsArray("template")));
}

function setSiteText(text)
{
    document.getElementById("content").innerHTML = text + ".";

}

async function fillTemplate(template)
{
    if(template.includes("\t"))
    {
        template = template.split("\t").join("")
    }

    if(template.includes("@"))
    {
        let command = getTextBetweenTags(template, "@", "@")
        let keyword = command.split(":")[0]
        let replace = "NOTHING TO REPLACE"
        let modifiers = [];

		if (command.includes(':')) {
			modifiers = command.split(':')[1].split(',');
		}
        await new Promise(r => setTimeout(r, 2000));
        template = template.fontcolor("white")
        switch(keyword) 
        {
            case "player":
                replace = generatePlayer(modifiers)
                break;
            case "storytype":
                replace = generateStorymode(modifiers)
                break;
            case "character":
                replace = generateCharacter(modifiers)
                break;
            case "character_description":
                replace = generateCharacterDesc(modifiers)
                break;
            case "character_description_post":
                replace = generateCharacterDescPost(modifiers)
                break;
            case "mpgames":
                replace = generateMPGames(modifiers)
                break;
            case "goal_prefix":
                replace = generateGoalPrefix(modifiers)
                break;
            case "goal":
                replace = generateGoal(modifiers)
                break;
            case "mood":
                replace = generateMood(modifiers)
                break;
        }
        replace = replace.fontcolor("red")
        template = replaceBetweenTags(template, replace, "@", "@")
        setSiteText(template)
        return fillTemplate(template)
    }

    template = parseBrackets(template)
    setSiteText(template)
    await new Promise(r => setTimeout(r, 2000));
    template = parseOption(template)
    setSiteText(template)
    await new Promise(r => setTimeout(r, 2000));

    if(template.includes("{"))
    {
        template = parseArticle(template)
        setSiteText(template)
        return fillTemplate(template)
    }
    return template
}

function generatePlayer(modifiers)
{
    let result
    if(modifiers.includes("cangroup") && randomChance(0.2))
    {
        result = "@player@ and @player@"
        isCharacterInGroup = true
    }
    else
    {
        result = pickRandomFromList(getCategoryOptionsArray("player"))
    }

    return result
}

function generateCharacter(modifiers)
{
    let result
    result = isCharacterInGroup ? pluralize(pickRandomFromList(getCategoryOptionsArray("character"))) : pickRandomFromList(getCategoryOptionsArray("character"))

    return result
}

function generateCharacterDesc(modifiers)
{
    let result
    result = pickRandomFromList(getCategoryOptionsArray("character_description"))

    return result
}

function generateCharacterDescPost(modifiers)
{
    let result
    result = pickRandomFromList(getCategoryOptionsArray("character_description_post"))

    return result
}

function generateStorymode(modifiers)
{
    let result
    result = pickRandomFromList(getCategoryOptionsArray("storytype"))

    return result
}

function generateGoalPrefix(modifiers)
{
    let result
    result = pickRandomFromList(getCategoryOptionsArray("goal_prefix"))

    return result
}

function generateGoal(modifiers)
{
    let result
    result = pickRandomFromList(getCategoryOptionsArray("goal"))

    return result
}

function generateMPGames(modifiers)
{
    let result
    result = pickRandomFromList(getCategoryOptionsArray("mpgames"))

    return result
}

function generateMood(modifiers)
{
    let result
    result = pickRandomFromList(getCategoryOptionsArray("mood"))

    return result
}

function getCategoryOptionsArray(name)
{
    let toReturn = getTextBetweenTags(data, "#" + name + ":\n", "#end").split("\n")
    return toReturn.slice(0, toReturn.length-1)
}

function getTextBetweenTags(text, startTag, endTag) 
{
	return text.split(startTag)[1].split(endTag)[0];
}

function replaceBetweenTags(text, replace, startTag, endTag)
{
    let textBetween = getTextBetweenTags(text, startTag, endTag)
    let startRemoved = text.replace(startTag, "")
    let endRemoved = startRemoved.replace(endTag, "")

    let toReturn = endRemoved.replace(textBetween, replace)

    toReturn = toReturn.fontcolor("green")
    return toReturn
}

function parseBrackets(text)
{
    let replacementText = text

    while (replacementText.includes("["))
    {
        let wordsWithin = getTextBetweenTags(replacementText, "[", "]").split(", ")
        replacementText = replaceBetweenTags(replacementText, pickRandomFromList(wordsWithin), "[", "]")
    }

    return replacementText
}

function parseArticle(text)
{
    let replacementText = text
    let isACap = (text.charAt(text.indexOf("{") + 1) == text.charAt(text.indexOf("{") + 1).toUpperCase())

    if(text.charAt(text.indexOf("{") + 4).match(/[aeiou]/i))
    {
        replacementText = replaceBetweenTags(replacementText, isACap ? "An" : "an", "{", "}") 
    }
    else
    {
        replacementText = replaceBetweenTags(replacementText, isACap ? "A" : "a", "{", "}") 
    }
    return replacementText
}

function parseOption(text)
{
    let replacementText = text

    while (replacementText.includes("("))
    {
        let wordsWithin = getTextBetweenTags(replacementText, "(", ")").split(",")
        replacementText = replaceBetweenTags(replacementText, isCharacterInGroup ? wordsWithin[1] : wordsWithin[0], "(", ")")
    }
    isCharacterInGroup = false
    return replacementText
}

function pluralize(word) {
	// exceptions:
	switch (word) {
	case 'goose':
		return 'geese';
	case 'fish':
		return 'fish';
	case 'human':
		return 'humans';
	case 'fish':
		return word;
	case 'thief':
		return 'thieves';
	default:
		// general rules:
		if (word.substr(-2) == 'ey') {
			return word + 's';
		}
		if (word.substr(-1) == 'y') {
			return word.substring(0, word.length-1) + 'ies';
		}
		if (word.substr(-1) == 'h') {
			return word + 'es';
		}
		if (word.substr(-3) == 'man') {
			return word.substring(0, word.length-3) + 'men';
		}
		if (word.substr(-5) == 'child') {
			return word + 'ren';
		}

		return word + 's';
	}
}

function cleanOutput(text)
{
    // Clean taps etc.
}

function randomChance(probability) 
{
	return Math.random() < probability;
}

function pickRandomFromList(list)
{
        let randomIndex = Math.floor(Math.random() * list.length); 
        return list[randomIndex];
}
