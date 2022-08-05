# File Specification

File specification is provided in eBPF form and validated using [BNF Playground](https://bnfplayground.pauliankline.com/).

Generated JSON is validated using [JSON Formatter & Validator](https://jsonformatter.curiousconcept.com/#)
```
/*************** TOP LEVEL ***************/
    <FILE>             ::= "{" <PCB_DATA> "}"

    <PCB_DATA>         ::= <METADATA> "," <BOARD_DATA> "," <PARTS_DATA> ("," <PCB_TEST_POINTS_DATA>)? ("," <CONFIGURATION_DATA>)?

    /*************** METADATA SECTION ***************/
    <METADATA>         ::= "\"metadata\":" "{" <PROTOCOL_VERSION> "," <ECAD> "," <COMPANY_NAME> "," <PROJECT_NAME> "," <PROJECT_REVISION> "," <DATE> "," <NUMBER_PARTS> "}"

    <PROTOCOL_VERSION> ::= "\"protocol_version\":" <POSITIVE_REAL_NUMBER>

    <PROJECT_REVISION> ::= "\"revision\":" "\"" <STRING> "\""
    <COMPANY_NAME>     ::= "\"company\":"  "\"" <STRING> "\""

    <ECAD>             ::= "\"ecad\":" <ECAD_PROGRAM>
    <ECAD_PROGRAM>     ::= <EAGLE_CAD>
    <EAGLE_CAD>        ::= "\"EAGLE\"" | "\"eagle\"" | "\"Eagle\""

    <PROJECT_NAME>     ::= "\"project_name\"" ":" "\"" <STRING>  "\""

    <DATE>             ::= "\"date\":" "\"" <DATE_STRING> "\""

    <NUMBER_PARTS>     ::= "\"number_parts\":" "{" <PARTS_TOP> "," <PARTS_BOTTOM> "}"
    <PARTS_TOP>        ::= "\"top\":" <UNSIGNED_INTEGER>
    <PARTS_BOTTOM>     ::= "\"bottom\":" <UNSIGNED_INTEGER>


    /*************** BOARD SECTION ***************/
    <BOARD_DATA>    ::= "\"board\":" "{" <BOARD_SHAPE> "," <BOARD_TRACES>  "," <BOARD_LAYERS> "}"
    <BOARD_SHAPE>   ::= <BOUNDING_BOX>
    <BOARD_TRACES>  ::= "\"traces\":" "[" <PCB_TRACES> "]"
    <BOARD_LAYERS>  ::= "\"layers\":" "[" <PCB_LAYERS> "]"

    <PCB_TRACES> ::= <PCB_TRACE> | <PCB_TRACE> "," <PCB_TRACES>
    <PCB_TRACE>  ::= "{" <NAME> "," <SEGMENTS> "}"

    <PCB_LAYERS> ::= <PCB_LAYER> | <PCB_LAYER> "," <PCB_LAYERS>
    <PCB_LAYER>  ::= "{" <NAME> "," "\"paths\":" "[" <PATHS> "]" "}"


    /*************** PARTS SECTION ***************/
    <PARTS_DATA> ::= "\"parts\":" "[" <PARTS> "]"

    <PARTS> ::= <PART> | <PART> "," <PARTS>
    <PART>  ::= "{" <NAME> "," <VALUE> "," <PART_PACKAGE> "," <PART_ATTRIBUTE> "," <PART_LOCATION> "}"

    <PART_PACKAGE>         ::= "\"package\":" "{" <PACKAGE_PADS> "," <PACKAGE_BOUNDING_BOX> "}"
    <PART_ATTRIBUTE>       ::= "\"attributes\":" "[" <ATTRIBUTES> "]"
    <PART_LOCATION>        ::= "\"location\":" <LOCATION>

    /* F = Front, B = Back, N = Neither */
    <LOCATION>  ::= "\"F\"" | "\"B\"" | "\"N\""

    <ATTRIBUTES> ::= <ATTRIBUTE> | <ATTRIBUTE> "," <ATTRIBUTES>
    <ATTRIBUTE>  ::= "{" <NAME> "," <VALUE> "}"


    <PACKAGE_PADS>         ::= "\"pads\":" "[" <PADS> "]"
    <PACKAGE_BOUNDING_BOX> ::= <BOUNDING_BOX>


    <PADS> ::= <PAD> | <PAD> "," <PADS>
    <PAD>  ::= <PAD_SMD> | <PAD_RECTANGLE> | <PAD_ROUND> | <PAD_OCTAGON> | <PAD_OBLONG> | <PAD_OFFSET>

    <PAD_SMD>       ::= "{" <PAD_PIN_ONE>  "," <PAD_TYPE_SMD>      "," <ANGLE> "," <X> "," <Y> "," <DX>       "," <DY> "}"
    <PAD_RECTANGLE> ::= "{" <PAD_PIN_ONE>  "," <PAD_TYPE_RECTAGLE> "," <ANGLE> "," <X> "," <Y> "," <DX>       "," <DY> "," <DRILL_TABLE> "}"
    <PAD_ROUND>     ::= "{" <PAD_PIN_ONE>  "," <PAD_TYPE_ROUND>    "," <ANGLE> "," <X> "," <Y> "," <DIAMETER> "," <DRILL_TABLE> "}"
    <PAD_OCTAGON>   ::= "{" <PAD_PIN_ONE>  "," <PAD_TYPE_OCTAGON>  "," <ANGLE> "," <X> "," <Y> "," <DIAMETER> "," <DRILL_TABLE> "}"
    <PAD_OBLONG>    ::= "{" <PAD_PIN_ONE>  "," <PAD_TYPE_OBLONG>   "," <ANGLE> "," <X> "," <Y> "," <DIAMETER> "," <ELONGATION> "," <DRILL_TABLE> "}"
    <PAD_OFFSET>    ::= "{" <PAD_PIN_ONE>  "," <PAD_TYPE_OFFSET>   "," <ANGLE> "," <X> "," <Y> "," <DIAMETER> "," <ELONGATION> "," <DRILL_TABLE> "}"

    /*  1 = Yes, 0 = No */
    <PAD_PIN_ONE> ::= "\"pin1\":0" | "\"pin1\":1"

    <PAD_TYPE_SMD>      ::= "\"type\":" "\"smd\""
    <PAD_TYPE_RECTAGLE> ::= "\"type\":" "\"rect\""
    <PAD_TYPE_OBLONG>   ::= "\"type\":" "\"oblong\""
    <PAD_TYPE_ROUND>    ::= "\"type\":" "\"round\""
    <PAD_TYPE_OCTAGON>  ::= "\"type\":" "\"octagon\""
    <PAD_TYPE_OFFSET>   ::= "\"type\":" "\"offset\""


    /*************** CONFIG SECTION ***************/

    <CONFIGURATION_DATA> ::= "\"configuration\":" "[" <PARAMETERS> "]"
    <PARAMETERS>         ::= <PARAMETER> | <PARAMETER> "," <PARAMETERS>
    <PARAMETER>          ::= "{" <NAME> "," <VALUE> "}"

    /*************** TEST POINT SECTION ***************/
    <PCB_TEST_POINTS_DATA> ::= "\"test points\":" "[" <TEST_POINTS> "]"

    <TEST_POINTS>     ::= <TEST_POINT> | <TEST_POINT> "," <TEST_POINTS>
    <TEST_POINT>      ::= "{" <NAME> "," <TEST_POINT_DESCRIPTION> "," <TEST_POINT_EXPECTED> "}"


    <TEST_POINT_DESCRIPTION> ::= "\"description\":" "\"" <STRING> "\""
    <TEST_POINT_EXPECTED>    ::= "\"expected\":" "\"" <STRING> "\""
    /*************** COMMON RULES ***************/

    <SEGMENTS>         ::= "\"segments\":" "[" <SEGMENT> "]"
    <SEGMENT>          ::= <PATHS> | <POLYGONS> | <VIAS>

    <PATHS>            ::= <PATH>    | <PATH>    "," <PATHS>
    <POLYGONS>         ::= <POLYGON> | <POLYGON> "," <POLYGONS>
    <VIAS>             ::= <VIA>     | <VIA>     "," <VIAS>

    <PATH>             ::= <LINE> | <ARC>
    <VIA>              ::= <VIA_ROUND> | <VIA_SQUARE> | <VIA_OCTAGON>

    <LINE>         ::= "{" <SEGMENT_TYPE_LINE>        "," <LAYER> "," <X0> "," <Y0> "," <X1> "," <Y1> "," <WIDTH> "}"
    <ARC>          ::= "{" <SEGMENT_TYPE_ARC>         "," <LAYER> "," <X>  "," <Y>  "," <RADIUS> "," <ANGLE0> "," <ANGLE1> "," <WIDTH> "," <DIRECTION> "}"
    <POLYGON>      ::= "{" <SEGMENT_TYPE_POLYGON>     "," <LAYER> "," <POLYGON_DIRECTION> "," <SEGMENTS> "}"
    <VIA_ROUND>    ::= "{" <SEGMENT_TYPE_VIA_ROUND>   "," <X> "," <Y> "," <DIAMETER> "," <DRILL_TABLE> "}"
    <VIA_SQUARE>   ::= "{" <SEGMENT_TYPE_VIA_SQUARE>  "," <X> "," <Y> "," <DIAMETER> "," <DRILL_TABLE> "}"
    <VIA_OCTAGON>  ::= "{" <SEGMENT_TYPE_VIA_OCTAGON> "," <X> "," <Y> "," <DIAMETER> "," <DRILL_TABLE> "}"


    <ARC_DIRECTION>     ::= "\"clockwise\"" | "\"counterclockwise\""
    <POLYGON_DIRECTION> ::= "\"positive\":0" | "\"positive\":1"

    <SEGMENT_TYPE_LINE>        ::= "\"type\"" ":" "\"line\""
    <SEGMENT_TYPE_ARC>         ::= "\"type\"" ":" "\"arc\""
    <SEGMENT_TYPE_POLYGON>     ::= "\"type\"" ":" "\"polygon\""
    <SEGMENT_TYPE_VIA_ROUND>   ::= "\"type\"" ":" "\"via_round\""
    <SEGMENT_TYPE_VIA_SQUARE>  ::= "\"type\"" ":" "\"via_square\""
    <SEGMENT_TYPE_VIA_OCTAGON> ::= "\"type\"" ":" "\"via_octagon\""

    <LAYER> ::= "\"layer\":" <STRING>
    <WIDTH> ::= "\"width\"" ":" <REAL_NUMBER>
    <DIRECTION> ::= "\"direction\"" ":" <ARC_DIRECTION>

    <BOUNDING_BOX> ::= "\"bounding_box\":" "{" <X0> "," <Y0> "," <X1> "," <Y1> "}"
    <X0>           ::= "\"x0\":" <REAL_NUMBER>
    <Y0>           ::= "\"y0\":" <REAL_NUMBER>
    <X1>           ::= "\"x1\":" <REAL_NUMBER>
    <Y1>           ::= "\"y1\":" <REAL_NUMBER>

    <X>           ::= "\"x\":" <REAL_NUMBER>
    <Y>           ::= "\"y\":" <REAL_NUMBER>
    <DX>          ::= "\"dx\":" <REAL_NUMBER>
    <DY>          ::= "\"dy\":" <REAL_NUMBER>

    <DRILL_TABLE>       ::= "\"drill_table\":" "[" <DRILL_TABLE_ENTRY> "]"
    <DRILL_TABLE_ENTRY> ::= "{" <LAYER> "," <DIAMETER> "}"

    <ELONGATION> ::= "\"elongation\":" <POSITIVE_REAL_NUMBER>
    <DIAMETER>   ::= "\"diameter\":" <REAL_NUMBER>
    <RADIUS>     ::= "\"radius\"" ":" <REAL_NUMBER>
    <ANGLE0>    ::= "\"angle0\"" ":" <REAL_NUMBER>
    <ANGLE1>    ::= "\"angle1\"" ":" <REAL_NUMBER>

    <NAME>  ::= "\"name\":" "\"" <STRING> "\""
    <VALUE> ::= "\"name\":" "\"" <STRING> "\""
    <UNSIGNED_INTEGER>     ::=        ("0" | [1-9] [0-9]*)
    <SIGNED_INTEGER>       ::= ("-")? ("0" | [1-9] [0-9]*)

    <REAL_NUMBER>          ::= <POSITIVE_REAL_NUMBER> | <NEGATIVE_REAL_NUMBER>
    <POSITIVE_REAL_NUMBER> ::=     ("0" |  [1-9] [0-9]*) ("." [0-9]+ )?
    <NEGATIVE_REAL_NUMBER> ::= "-" ([1-9] [0-9]*) ("." [0-9]+ )? | "-" ("0" "." [0-9]+)

    <STRING>      ::= ([a-z] | [A-Z]) ([a-z] | [A-Z] | [0-9] | "-" | "_" | "$")*
    <DATE_STRING> ::= ([a-z] | [A-Z] | [0-9] | "-" | "_" | ":" | " ")*

    <ANGLE> ::= "\"angle\":" <REAL_NUMBER>
```
