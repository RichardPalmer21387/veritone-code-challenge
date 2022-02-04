export function logWelcomeMessage() {
	console.log(`%c
  _    _      _ _        __      __       _ _                     _____                 _ 
 | |  | |    | | |       \\ \\    / /      (_) |                   |  __ \\               | |
 | |__| | ___| | | ___    \\ \\  / /__ _ __ _| |_ ___  _ __   ___  | |  | | _____   _____| |
 |  __  |/ _ \\ | |/ _ \\    \\ \\/ / _ \\ '__| | __/ _ \\| '_ \\ / _ \\ | |  | |/ _ \\ \\ / / __| |
 | |  | |  __/ | | (_) |    \\  /  __/ |  | | || (_) | | | |  __/ | |__| |  __/\\ V /\\__ \\_|
 |_|  |_|\\___|_|_|\\___/      \\/ \\___|_|  |_|\\__\\___/|_| |_|\\___| |_____/ \\___| \\_/ |___(_)
                                                                                          
%c I like to use a logger util to help keep my console clean and prevent any unwanted developer info messages from showing up in my projects unexpectly.
 Perhapes you have heard of loglevel? Highly recommended.  I have bound a reference to the window for your convenience.  If you would like to enable all logging at this time, just run:
%c log.enableAll()
%c And %cthank you%c for your time reviewing this!                                                                                      
`,
	'font-size:1.5em; font-weight: bolder; color: #1871E8;',
	'font-size:1.5em; font-weight: normal',
	'font-size:2em; font-weight: normal; line-height:2em;',
	'font-size:1.5em;',
	'font-size:1.5em; font-style:italic',
	'font-size:1.5em;',
	);
}

export default logWelcomeMessage;
