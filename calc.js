<script>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/6.6.0/math.js"></script>

const entries = {
    NUM: 'num',
    DECIMAL: 'decim',
    OPERAND: 'operand',
    POPEN: 'open',
    PCLOSE: 'close',
    EQUALS: 'equals'
};
lastEntry = entries.EQUALS;
numOpenParen = 0;
hasDecimal = false;

$('[number]').click(
    function() {
        if (lastEntry === entries.EQUALS){
            $('.displayLast').text($('.displayCurrent').text());
            $('.displayCurrent').text("");
        }
        $('.displayCurrent').text($('.displayCurrent').text().concat($(this).text()));
        lastEntry = entries.NUM;
    }
);

$('[decimal]').click(
    function() {
        if(hasDecimal)
            return;
        if (lastEntry === entries.EQUALS){
            $('.displayLast').text($('.displayCurrent').text());
            $('.displayCurrent').text("");
        }
        if (lastEntry !== entries.NUM){
            $('.displayCurrent').text($('.displayCurrent').text().concat('0'));
        }
        $('.displayCurrent').text($('.displayCurrent').text().concat($(this).text()));
        lastEntry = entries.DECIMAL;
        hasDecimal = true;
    }
);

$('[operand]').click(
    function() {
        if (lastEntry === entries.EQUALS) {
            $('.displayLast').text($('.displayCurrent').text());
        } else if (lastEntry === entries.POPEN){
            if ($(this).text() === '÷' || $(this).text() === '×')
                return;
            else
                $('.displayCurrent').text($('.displayCurrent').text().slice(0, $('.displayCurrent').text().length-1));
        } else if (lastEntry === entries.OPERAND){
            if (($('.displayCurrent').text().endsWith("( + ")||$('.displayCurrent').text().endsWith("( - "))
                && ($(this).text() === '÷' || $(this).text() === '×')){
                return;
            }else{
                $('.displayCurrent').text($('.displayCurrent').text().slice(0, $('.displayCurrent').text().length-3));
            }
        } else if (lastEntry === entries.DECIMAL){
            $('.displayCurrent').text($('.displayCurrent').text().concat('0'));
        }

        $('.displayCurrent').text($('.displayCurrent').text().concat(' ', $(this).text(), ' '));
        lastEntry = entries.OPERAND;
        hasDecimal = false;
    }
);

$('[pOpen]').click(
    function() {
        if (lastEntry === entries.EQUALS){
            $('.displayLast').text($('.displayCurrent').text());
            $('.displayCurrent').text("");
        } else if (lastEntry === entries.DECIMAL){
            $('.displayCurrent').text($('.displayCurrent').text().concat('0'));
        } else if (lastEntry !== entries.NUM){
            $('.displayCurrent').text($('.displayCurrent').text().slice(0, $('.displayCurrent').text().length-1));
        }
        $('.displayCurrent').text($('.displayCurrent').text().concat(' ', $(this).text(), ' '));
        numOpenParen = numOpenParen + 1;
        lastEntry = entries.POPEN;
        hasDecimal = false;
    }
);

$('[pClose]').click(
    function() {
        if (numOpenParen < 1 || (lastEntry === entries.OPERAND || lastEntry === entries.POPEN)){
            return;
        }else if (lastEntry === entries.DECIMAL){
            $('.displayCurrent').text($('.displayCurrent').text().concat('0'));
        } else if (lastEntry !== entries.NUM){
            $('.displayCurrent').text($('.displayCurrent').text().slice(0, $('.displayCurrent').text().length-1));
        }
        $('.displayCurrent').text($('.displayCurrent').text().concat(' ', $(this).text(), ' '));
        numOpenParen = numOpenParen - 1;
        lastEntry = entries.PCLOSE;
        hasDecimal = false;
    }
);

$('[CE]').click(
    function() {
        if(lastEntry === entries.EQUALS) {
            $('.displayCurrent').text('0');
            numOpenParen = 0;
            lastEntry = entries.EQUALS;
            hasDecimal = false;
            return;
        }else if(lastEntry === entries.DECIMAL){
            $('.displayCurrent').text($('.displayCurrent').text().slice(0, $('.displayCurrent').text().length-1));
            hasDecimal = false;
        }else if(lastEntry === entries.NUM){
            $('.displayCurrent').text($('.displayCurrent').text().slice(0, $('.displayCurrent').text().length-1));
        }else if(lastEntry === entries.OPERAND){
            $('.displayCurrent').text($('.displayCurrent').text().slice(0, $('.displayCurrent').text().length-3));
        }else if(lastEntry === entries.POPEN){
            $('.displayCurrent').text($('.displayCurrent').text().slice(0, $('.displayCurrent').text().length-3));
            numOpenParen = numOpenParen - 1;
        }else if(lastEntry === entries.PCLOSE){
            $('.displayCurrent').text($('.displayCurrent').text().slice(0, $('.displayCurrent').text().length-3));
            numOpenParen = numOpenParen + 1;
        }
        if ($('.displayCurrent').text().length<1){
            $('.displayCurrent').text('0');
            numOpenParen = 0;
            lastEntry = entries.EQUALS;
            hasDecimal = false;
        } else if ($('.displayCurrent').text().endsWith('.')){
            lastEntry = entries.DECIMAL;
            hasDecimal = true;
        } else if ($('.displayCurrent').text().endsWith('(')){
            lastEntry = entries.POPEN;
            hasDecimal = false;
            $('.displayCurrent').text($('.displayCurrent').text().concat(' '));
        } else if ($('.displayCurrent').text().endsWith(')')){
            lastEntry = entries.PCLOSE;
            hasDecimal = false;
            $('.displayCurrent').text($('.displayCurrent').text().concat(' '));
        } else if ($('.displayCurrent').text().endsWith('+')
            || $('.displayCurrent').text().endsWith('-')
            || $('.displayCurrent').text().endsWith('÷')
            || $('.displayCurrent').text().endsWith('×')){
            lastEntry = entries.OPERAND;
            hasDecimal = false;
            $('.displayCurrent').text($('.displayCurrent').text().concat(' '));
        } else {
            lastEntry = entries.NUM;
        }
        return;
    }
);

$('[AC]').click(
    function() {
        if(lastEntry === entries.EQUALS)
            $('.displayLast').text($('.displayCurrent').text());
        $('.displayCurrent').text('0');
        numOpenParen = 0;
        lastEntry = entries.EQUALS;
        hasDecimal = false;
    }
);

$('[equals]').click(
    function() {
        if (lastEntry === entries.EQUALS)
            return;

        if (lastEntry === entries.DECIMAL)
            $('.displayCurrent').text($('.displayCurrent').text().concat('0'));

        let result = '';
        if (numOpenParen>0 || lastEntry === entries.OPERAND) {
            result = 'ERR';
            $('.displayLast').text($('.displayCurrent').text().concat(' = ', result));
            $('.displayCurrent').text("0");
        }else {
            let expression = $('.displayCurrent').text().replace(/÷/g, '/').replace(/×/g, '*');
            result = math.evaluate(expression);
            result = Math.round(result*100000000)/100000000;
            $('.displayLast').text($('.displayCurrent').text().concat(' = ', result));
            $('.displayCurrent').text(result);
        }

        hasDecimal = false;
        numOpenParen = 0;
        lastEntry = entries.EQUALS;
    }
)

</script>