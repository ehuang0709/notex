export const validateEmail = (email) => {
    // test standard email format
    // "/^" anchors regex at the start of the string
    // "[^\s@]+" char class that matches one or more chars that's not a whitespace or @ symbol
    // "@" checks the @ symbol in the email
    // "\." checks the . (dot) symbol in the email such as in ".com"
    // "$/" anchors reges at the end of the string

    // example: example  @  email    .   com
    //       /^ [^\s@]+  @  [^\s@]+  \.  [^\s@]+  $/
    
    // basically checks that the email:
        // starts with chars that aren't whitespace or '@' (representing email username)
        // has a single '@' symbol
        // followed by chars that aren't whitespace or '@' (representing mail server)
        // has a single '.' symbol
        // ends with chars that aren't whitespace or '@' (representing domain)
 
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export const getInitials = (name) => {
    if (!name) return "";

    const words = name.split(" ");
    let initials = "";

    for (let i = 0; i < Math.min(words.length, 2); i++) {
        initials += words[i][0];
    }

    return initials.toUpperCase();
}