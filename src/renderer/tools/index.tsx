import { getAllTools } from "../toolStore";

// import all tools to make them auto-register
import "./AsciiTable";
import "./AspectRatio";
import "./Base64";
import "./CanIUse";
import "./Color";
import "./Help";
import "./HtmlEntities";
import "./JsonFormatter";
import "./JsonTransformer";
import "./KimbleCalculator";
import "./LiquidTester";
import "./LodashPlayground";
import "./LoremIpsum";
import "./MomentPlayground";
import "./PasswordGenerator";
import "./Regex101";
import "./SheetsToJson";
import "./Unindent";
import "./Uuid";
import "./WordCounter";

// now all tools are registered here
const tools = getAllTools();

export default tools;
