import React, { useCallback } from "react";
import styled from "styled-components";
import copyToClipboard from "copy-to-clipboard";
import { toast } from "react-toastify";
import { displayName, setToolMeta } from "../utils";
import { TextField } from "../components/Fields";
import { usePersistedState } from "../persistedState";

const Container = displayName(
  "Container",
  styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  `
);

const Grid = displayName(
  "Grid",
  styled.div`
    --grid-border: #181818;

    display: grid;
    grid-template-columns: 0fr 0fr 0fr 0fr 0fr 0fr 1fr;
    gap: 1px;
    border: 1px solid var(--grid-border);
    background: var(--grid-border);
    max-height: 100%;
    overflow-y: scroll;
    box-sizing: border-box;

    & > * {
      background: var(--main-bg);
      height: 100%;
      align-content: space-around;
      padding: var(--gap-size);
      box-sizing: border-box;
    }
  `
);

const Header = displayName(
  "Header",
  styled.h3`
    margin: 0;
    align-self: center;
    position: sticky;
    top: 0;
    outline: 1px solid var(--grid-border);
    z-index: 1;
  `
);

const Cell = displayName(
  "Cell",
  styled.span`
    cursor: pointer;
    &.char {
      font-family: monospace;
      color: var(--input-fg);
    }
    :hover {
      background: var(--selection);
    }
  `
);

// convert html encoded text to plain text
const converter = document.createElement("textarea");
const htmlToText = (html) => {
  converter.innerHTML = html;
  return converter.value;
};

// decimal to hexadecimal number
const hex = (dec) => dec.toString(16).padStart(2, "0");

// code, symbol, number, name, description
const ascii = [
  [0, "NUL", "&#00;", "", "Null character"],
  [1, "SOH", "&#01;", "", "Start of Heading"],
  [2, "STX", "&#02;", "", "Start of Text"],
  [3, "ETX", "&#03;", "", "End of Text"],
  [4, "EOT", "&#04;", "", "End of Transmission"],
  [5, "ENQ", "&#05;", "", "Enquiry"],
  [6, "ACK", "&#06;", "", "Acknowledge"],
  [7, "BEL", "&#07;", "", "Bell, Alert"],
  [8, "BS", "&#08;", "", "Backspace"],
  [9, "HT", "&#09;", "", "Horizontal Tab"],
  [10, "LF", "&#10;", "", "Line Feed"],
  [11, "VT", "&#11;", "", "Vertical Tabulation"],
  [12, "FF", "&#12;", "", "Form Feed"],
  [13, "CR", "&#13;", "", "Carriage Return"],
  [14, "SO", "&#14;", "", "Shift Out"],
  [15, "SI", "&#15;", "", "Shift In"],
  [16, "DLE", "&#16;", "", "Data Link Escape"],
  [17, "DC1", "&#17;", "", "Device Control One (XON)"],
  [18, "DC2", "&#18;", "", "Device Control Two"],
  [19, "DC3", "&#19;", "", "Device Control Three (XOFF)"],
  [20, "DC4", "&#20;", "", "Device Control Four"],
  [21, "NAK", "&#21;", "", "Negative Acknowledge"],
  [22, "SYN", "&#22;", "", "Synchronous Idle"],
  [23, "ETB", "&#23;", "", "End of Transmission Block"],
  [24, "CAN", "&#24;", "", "Cancel"],
  [25, "EM", "&#25;", "", "End of medium"],
  [26, "SUB", "&#26;", "", "Substitute"],
  [27, "ESC", "&#27;", "", "Escape"],
  [28, "FS", "&#28;", "", "File Separator"],
  [29, "GS", "&#29;", "", "Group Separator"],
  [30, "RS", "&#30;", "", "Record Separator"],
  [31, "US", "&#31;", "", "Unit Separator"],
  [32, "SP", "&#32;", "", "Space"],
  [33, "", "&#33;", "&excl;", "Exclamation mark"],
  [34, "", "&#34;", "&quot;", "Double quotes (or speech marks)"],
  [35, "", "&#35;", "&num;", "Number sign"],
  [36, "", "&#36;", "&dollar;", "Dollar"],
  [37, "", "&#37;", "&percnt;", "Per cent sign"],
  [38, "", "&#38;", "&amp;", "Ampersand"],
  [39, "", "&#39;", "&apos;", "Single quote"],
  [40, "", "&#40;", "&lparen;", "Open parenthesis (or open bracket)"],
  [41, "", "&#41;", "&rparen;", "Close parenthesis (or close bracket)"],
  [42, "", "&#42;", "&ast;", "Asterisk"],
  [43, "", "&#43;", "&plus;", "Plus"],
  [44, "", "&#44;", "&comma;", "Comma"],
  [45, "", "&#45;", "", "Hyphen-minus"],
  [46, "", "&#46;", "&period;", "Period, dot or full stop"],
  [47, "", "&#47;", "&sol;", "Slash or divide"],
  [48, "", "&#48;", "", "Zero"],
  [49, "", "&#49;", "", "One"],
  [50, "", "&#50;", "", "Two"],
  [51, "", "&#51;", "", "Three"],
  [52, "", "&#52;", "", "Four"],
  [53, "", "&#53;", "", "Five"],
  [54, "", "&#54;", "", "Six"],
  [55, "", "&#55;", "", "Seven"],
  [56, "", "&#56;", "", "Eight"],
  [57, "", "&#57;", "", "Nine"],
  [58, "", "&#58;", "&colon;", "Colon"],
  [59, "", "&#59;", "&semi;", "Semicolon"],
  [60, "", "&#60;", "&lt;", "Less than (or open angled bracket)"],
  [61, "", "&#61;", "&equals;", "Equals"],
  [62, "", "&#62;", "&gt;", "Greater than (or close angled bracket)"],
  [63, "", "&#63;", "&quest;", "Question mark"],
  [64, "", "&#64;", "&commat;", "At sign"],
  [65, "", "&#65;", "", "Uppercase A"],
  [66, "", "&#66;", "", "Uppercase B"],
  [67, "", "&#67;", "", "Uppercase C"],
  [68, "", "&#68;", "", "Uppercase D"],
  [69, "", "&#69;", "", "Uppercase E"],
  [70, "", "&#70;", "", "Uppercase F"],
  [71, "", "&#71;", "", "Uppercase G"],
  [72, "", "&#72;", "", "Uppercase H"],
  [73, "", "&#73;", "", "Uppercase I"],
  [74, "", "&#74;", "", "Uppercase J"],
  [75, "", "&#75;", "", "Uppercase K"],
  [76, "", "&#76;", "", "Uppercase L"],
  [77, "", "&#77;", "", "Uppercase M"],
  [78, "", "&#78;", "", "Uppercase N"],
  [79, "", "&#79;", "", "Uppercase O"],
  [80, "", "&#80;", "", "Uppercase P"],
  [81, "", "&#81;", "", "Uppercase Q"],
  [82, "", "&#82;", "", "Uppercase R"],
  [83, "", "&#83;", "", "Uppercase S"],
  [84, "", "&#84;", "", "Uppercase T"],
  [85, "", "&#85;", "", "Uppercase U"],
  [86, "", "&#86;", "", "Uppercase V"],
  [87, "", "&#87;", "", "Uppercase W"],
  [88, "", "&#88;", "", "Uppercase X"],
  [89, "", "&#89;", "", "Uppercase Y"],
  [90, "", "&#90;", "", "Uppercase Z"],
  [91, "", "&#91;", "&lsqb;", "Opening bracket"],
  [92, "", "&#92;", "&bsol;", "Backslash"],
  [93, "", "&#93;", "&rsqb;", "Closing bracket"],
  [94, "", "&#94;", "&Hat;", "Caret - circumflex"],
  [95, "", "&#95;", "&lowbar;", "Underscore"],
  [96, "", "&#96;", "&grave;", "Grave accent"],
  [97, "", "&#97;", "", "Lowercase a"],
  [98, "", "&#98;", "", "Lowercase b"],
  [99, "", "&#99;", "", "Lowercase c"],
  [100, "", "&#100;", "", "Lowercase d"],
  [101, "", "&#101;", "", "Lowercase e"],
  [102, "", "&#102;", "", "Lowercase f"],
  [103, "", "&#103;", "", "Lowercase g"],
  [104, "", "&#104;", "", "Lowercase h"],
  [105, "", "&#105;", "", "Lowercase i"],
  [106, "", "&#106;", "", "Lowercase j"],
  [107, "", "&#107;", "", "Lowercase k"],
  [108, "", "&#108;", "", "Lowercase l"],
  [109, "", "&#109;", "", "Lowercase m"],
  [110, "", "&#110;", "", "Lowercase n"],
  [111, "", "&#111;", "", "Lowercase o"],
  [112, "", "&#112;", "", "Lowercase p"],
  [113, "", "&#113;", "", "Lowercase q"],
  [114, "", "&#114;", "", "Lowercase r"],
  [115, "", "&#115;", "", "Lowercase s"],
  [116, "", "&#116;", "", "Lowercase t"],
  [117, "", "&#117;", "", "Lowercase u"],
  [118, "", "&#118;", "", "Lowercase v"],
  [119, "", "&#119;", "", "Lowercase w"],
  [120, "", "&#120;", "", "Lowercase x"],
  [121, "", "&#121;", "", "Lowercase y"],
  [122, "", "&#122;", "", "Lowercase z"],
  [123, "", "&#123;", "&lcub;", "Opening brace"],
  [124, "", "&#124;", "&verbar;", "Vertical bar"],
  [125, "", "&#125;", "&rcub;", "Closing brace"],
  [126, "", "&#126;", "&tilde;", "Equivalency sign - tilde"],
  [127, "DEL", "&#127;", "", "Delete"],
  [128, "", "&#8364;", "&euro;", "Euro sign"],
  [129, "", "", "", "Unused"],
  [130, "", "&#130;", "&sbquo;", "Single low-9 quotation mark"],
  [131, "", "&#131;", "&fnof;", "Latin small letter f with hook"],
  [132, "", "&#132;", "&bdquo;", "Double low-9 quotation mark"],
  [133, "", "&#133;", "&hellip;", "Horizontal ellipsis"],
  [134, "", "&#134;", "&dagger;", "Dagger"],
  [135, "", "&#135;", "&Dagger;", "Double dagger"],
  [136, "", "&#136;", "&circ;", "Modifier letter circumflex accent"],
  [137, "", "&#137;", "&permil;", "Per mille sign"],
  [138, "", "&#138;", "&Scaron;", "Latin capital letter S with caron"],
  [139, "", "&#139;", "&lsaquo;", "Single left-pointing angle quotation"],
  [140, "", "&#140;", "&OElig;", "Latin capital ligature OE"],
  [141, "", "", "", "Unused"],
  [142, "", "&#142;", "&Zcaron;", "Latin capital letter Z with caron"],
  [143, "", "", "", "Unused"],
  [144, "", "", "", "Unused"],
  [145, "", "&#145;", "&lsquo;", "Left single quotation mark"],
  [146, "", "&#146;", "&rsquo;", "Right single quotation mark"],
  [147, "", "&#147;", "&ldquo;", "Left double quotation mark"],
  [148, "", "&#148;", "&rdquo;", "Right double quotation mark"],
  [149, "", "&#149;", "&bull;", "Bullet"],
  [150, "", "&#150;", "&ndash;", "En dash"],
  [151, "", "&#151;", "&mdash;", "Em dash"],
  [152, "", "&#152;", "&tilde;", "Small tilde"],
  [153, "", "&#153;", "&trade;", "Trade mark sign"],
  [154, "", "&#154;", "&scaron;", "Latin small letter S with caron"],
  [155, "", "&#155;", "&rsaquo;", "Single right-pointing angle quotation mark"],
  [156, "", "&#156;", "&oelig;", "Latin small ligature oe"],
  [157, "", "", "", "Unused"],
  [158, "", "&#158;", "&zcaron;", "Latin small letter z with caron"],
  [159, "", "&#159;", "&Yuml;", "Latin capital letter Y with diaeresis"],
  [160, "NBSP", "&#160;", "&nbsp;", "Non-breaking space"],
  [161, "", "&#161;", "&iexcl;", "Inverted exclamation mark"],
  [162, "", "&#162;", "&cent;", "Cent sign"],
  [163, "", "&#163;", "&pound;", "Pound sign"],
  [164, "", "&#164;", "&curren;", "Currency sign"],
  [165, "", "&#165;", "&yen;", "Yen sign"],
  [166, "", "&#166;", "&brvbar;", "Pipe, broken vertical bar"],
  [167, "", "&#167;", "&sect;", "Section sign"],
  [168, "", "&#168;", "&uml;", "Spacing diaeresis - umlaut"],
  [169, "", "&#169;", "&copy;", "Copyright sign"],
  [170, "", "&#170;", "&ordf;", "Feminine ordinal indicator"],
  [171, "", "&#171;", "&laquo;", "Left double angle quotes"],
  [172, "", "&#172;", "&not;", "Negation"],
  [173, "SHY", "&#173;", "&shy;", "Soft hyphen"],
  [174, "", "&#174;", "&reg;", "Registered trade mark sign"],
  [175, "", "&#175;", "&macr;", "Spacing macron - overline"],
  [176, "", "&#176;", "&deg;", "Degree sign"],
  [177, "", "&#177;", "&plusmn;", "Plus-or-minus sign"],
  [178, "", "&#178;", "&sup2;", "Superscript two - squared"],
  [179, "", "&#179;", "&sup3;", "Superscript three - cubed"],
  [180, "", "&#180;", "&acute;", "Acute accent - spacing acute"],
  [181, "", "&#181;", "&micro;", "Micro sign"],
  [182, "", "&#182;", "&para;", "Pilcrow sign - paragraph sign"],
  [183, "", "&#183;", "&middot;", "Middle dot - Georgian comma"],
  [184, "", "&#184;", "&cedil;", "Spacing cedilla"],
  [185, "", "&#185;", "&sup1;", "Superscript one"],
  [186, "", "&#186;", "&ordm;", "Masculine ordinal indicator"],
  [187, "", "&#187;", "&raquo;", "Right double angle quotes"],
  [188, "", "&#188;", "&frac14;", "Fraction one quarter"],
  [189, "", "&#189;", "&frac12;", "Fraction one half"],
  [190, "", "&#190;", "&frac34;", "Fraction three quarters"],
  [191, "", "&#191;", "&iquest;", "Inverted question mark"],
  [192, "", "&#192;", "&Agrave;", "Latin capital letter A with grave"],
  [193, "", "&#193;", "&Aacute;", "Latin capital letter A with acute"],
  [194, "", "&#194;", "&Acirc;", "Latin capital letter A with circumflex"],
  [195, "", "&#195;", "&Atilde;", "Latin capital letter A with tilde"],
  [196, "", "&#196;", "&Auml;", "Latin capital letter A with diaeresis"],
  [197, "", "&#197;", "&Aring;", "Latin capital letter A with ring above"],
  [198, "", "&#198;", "&AElig;", "Latin capital letter AE"],
  [199, "", "&#199;", "&Ccedil;", "Latin capital letter C with cedilla"],
  [200, "", "&#200;", "&Egrave;", "Latin capital letter E with grave"],
  [201, "", "&#201;", "&Eacute;", "Latin capital letter E with acute"],
  [202, "", "&#202;", "&Ecirc;", "Latin capital letter E with circumflex"],
  [203, "", "&#203;", "&Euml;", "Latin capital letter E with diaeresis"],
  [204, "", "&#204;", "&Igrave;", "Latin capital letter I with grave"],
  [205, "", "&#205;", "&Iacute;", "Latin capital letter I with acute"],
  [206, "", "&#206;", "&Icirc;", "Latin capital letter I with circumflex"],
  [207, "", "&#207;", "&Iuml;", "Latin capital letter I with diaeresis"],
  [208, "", "&#208;", "&ETH;", "Latin capital letter ETH"],
  [209, "", "&#209;", "&Ntilde;", "Latin capital letter N with tilde"],
  [210, "", "&#210;", "&Ograve;", "Latin capital letter O with grave"],
  [211, "", "&#211;", "&Oacute;", "Latin capital letter O with acute"],
  [212, "", "&#212;", "&Ocirc;", "Latin capital letter O with circumflex"],
  [213, "", "&#213;", "&Otilde;", "Latin capital letter O with tilde"],
  [214, "", "&#214;", "&Ouml;", "Latin capital letter O with diaeresis"],
  [215, "", "&#215;", "&times;", "Multiplication sign"],
  [216, "", "&#216;", "&Oslash;", "Latin capital letter O with slash"],
  [217, "", "&#217;", "&Ugrave;", "Latin capital letter U with grave"],
  [218, "", "&#218;", "&Uacute;", "Latin capital letter U with acute"],
  [219, "", "&#219;", "&Ucirc;", "Latin capital letter U with circumflex"],
  [220, "", "&#220;", "&Uuml;", "Latin capital letter U with diaeresis"],
  [221, "", "&#221;", "&Yacute;", "Latin capital letter Y with acute"],
  [222, "", "&#222;", "&THORN;", "Latin capital letter THORN"],
  [223, "", "&#223;", "&szlig;", "Latin small letter sharp s - ess-zed"],
  [224, "", "&#224;", "&agrave;", "Latin small letter a with grave"],
  [225, "", "&#225;", "&aacute;", "Latin small letter a with acute"],
  [226, "", "&#226;", "&acirc;", "Latin small letter a with circumflex"],
  [227, "", "&#227;", "&atilde;", "Latin small letter a with tilde"],
  [228, "", "&#228;", "&auml;", "Latin small letter a with diaeresis"],
  [229, "", "&#229;", "&aring;", "Latin small letter a with ring above"],
  [230, "", "&#230;", "&aelig;", "Latin small letter ae"],
  [231, "", "&#231;", "&ccedil;", "Latin small letter c with cedilla"],
  [232, "", "&#232;", "&egrave;", "Latin small letter e with grave"],
  [233, "", "&#233;", "&eacute;", "Latin small letter e with acute"],
  [234, "", "&#234;", "&ecirc;", "Latin small letter e with circumflex"],
  [235, "", "&#235;", "&euml;", "Latin small letter e with diaeresis"],
  [236, "", "&#236;", "&igrave;", "Latin small letter i with grave"],
  [237, "", "&#237;", "&iacute;", "Latin small letter i with acute"],
  [238, "", "&#238;", "&icirc;", "Latin small letter i with circumflex"],
  [239, "", "&#239;", "&iuml;", "Latin small letter i with diaeresis"],
  [240, "", "&#240;", "&eth;", "Latin small letter eth"],
  [241, "", "&#241;", "&ntilde;", "Latin small letter n with tilde"],
  [242, "", "&#242;", "&ograve;", "Latin small letter o with grave"],
  [243, "", "&#243;", "&oacute;", "Latin small letter o with acute"],
  [244, "", "&#244;", "&ocirc;", "Latin small letter o with circumflex"],
  [245, "", "&#245;", "&otilde;", "Latin small letter o with tilde"],
  [246, "", "&#246;", "&ouml;", "Latin small letter o with diaeresis"],
  [247, "", "&#247;", "&divide;", "Division sign"],
  [248, "", "&#248;", "&oslash;", "Latin small letter o with slash"],
  [249, "", "&#249;", "&ugrave;", "Latin small letter u with grave"],
  [250, "", "&#250;", "&uacute;", "Latin small letter u with acute"],
  [251, "", "&#251;", "&ucirc;", "Latin small letter u with circumflex"],
  [252, "", "&#252;", "&uuml;", "Latin small letter u with diaeresis"],
  [253, "", "&#253;", "&yacute;", "Latin small letter y with acute"],
  [254, "", "&#254;", "&thorn;", "Latin small letter thorn"],
  [255, "", "&#255;", "&yuml;", "Latin small letter y with diaeresis"],
];

// pre-calculate search terms
const search = ascii.map(([code, symbol, number, name, description]) =>
  [symbol || htmlToText(number), code, hex(code), number, name, description]
    .join(" ")
    .toLowerCase()
);

// copy the original character or other cell text
const copyCell = (element) => {
  const html = element.dataset.html;
  const text = html ? htmlToText(html) : element.innerText;
  if (!text) return;
  copyToClipboard(text);
  toast.success(`"${text}" copied to clipboard.`);
};

const AsciiTable = () => {
  const [filter, setFilter] = usePersistedState(AsciiTable, "filter", "");
  const filterLower = filter.toLowerCase();

  const onKeyDown = useCallback((event) => {
    if (event.code !== "Enter") return;
    const first = document.querySelector("span.char");
    if (!first) return;
    copyCell(first);
  }, []);

  const onClick = useCallback(({ target }) => {
    if (target.tagName !== "SPAN") return;
    copyCell(target);
  }, []);

  return (
    <Container>
      <div>
        <TextField
          state={filter}
          setState={setFilter}
          onKeyDown={onKeyDown}
          placeholder="Filter"
          type="search"
          autoFocus
        />
      </div>
      <Grid onClick={onClick}>
        <Header>Dec</Header>
        <Header>Hex</Header>
        <Header>Symbol / Char</Header>
        <Header>Unicode</Header>
        <Header>HTML Number</Header>
        <Header>HTML Name</Header>
        <Header>Description</Header>
        {ascii
          .filter((_, index) => search[index].includes(filterLower))
          .map(([code, symbol, number, name, desc]) => (
            <>
              <Cell>{code}</Cell>
              <Cell>{hex(code)}</Cell>
              <Cell
                dangerouslySetInnerHTML={{
                  __html: symbol || number,
                }}
                data-html={number}
                className="char"
              />
              <Cell>{`\\x${hex(code)}`}</Cell>
              <Cell>{number}</Cell>
              <Cell>{name}</Cell>
              <Cell>{desc}</Cell>
            </>
          ))}
      </Grid>
    </Container>
  );
};

setToolMeta(AsciiTable, {
  name: "AsciiTable",
  description: "ASCII table.",
});

export default AsciiTable;
