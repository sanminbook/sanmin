# sanmin
三民書局轉換器

## prerequisite: nodejs git

輸入：92620diamondsutra.xml  （三民提供）
其中92620 為 書號，diamondsutra 金剛經，助記用。

執行轉檔程序：

    node gen

得到  
    off/92620diamonsutra-seg0.txt 經文
    off/92620diamonsutra-seg1.txt 章旨
    off/92620diamonsutra-seg2.txt 百話
    off/92620diamonsutra-seg4.txt 題解 (暫不處理)
    

## 經文標記：

將 經文、章旨、百話 三者做逐句對照，製成平行語料。

製成 off/92620.off sanbin-bh.offtext/92620.off sanbin-ex.offtext/92620ex.off

TODO : 加上四種別譯、梵文、英文

### 範例

92620diamonsutrasutra-seg0.txt

    若^t(有色)、若^t(無色)，若^t(有想)、若^t(無想)、若^t(非有想非無想)，

改為：

    若^t#rupino〔有色〕、若^t#arupino〔無色〕，若^t#samjnino〔有想〕、若^t#asamjnino〔無想〕、若^t#nasamjnino〔非有想非無想〕，

rupino, arupino 為詞條id 。

## 詞條標記

詞條取材自 92620diamondsutra.xml 的注釋群，主題明確，篇幅短的注釋直接沿用。個別長注應拆分成小詞條，以便利閱讀及重用。

原註：非有想非無想	pg17.para13

    無色界中非有想非無想天的眾生。有想、無想、非有想非無想是佛教對眾生有無或非有非無心識的劃分。佛教的宇宙構成論用一種立體的層次結構劃分世界，將世界劃分為佛國世界與世俗世界，又將世俗世界劃分為欲界、色界和無色界，即所謂的「三界」。欲界是一切由各種欲望支配的生命形式的居所………省去數百字………………

作者為解釋「非有想非無想」，則必須先解釋 無色界(arupadhatu) 以及上層觀念 三界(triloka)。

    nasamjnino	無色界中非有想非無想天的眾生。有想、無想、非有想非無想是佛教對眾生有無或非有非無心識的劃分。佛教的宇宙構成論用一種立體的層次結構劃分世界，將世界劃分為佛國世界與世俗世界，又將世俗世界劃分為^t#kamadhatu(欲界)、^t#rupadhatu(色界)和^t#arupadhatu(無色界)，即所謂的「^t#triloka(三界)」。
    triloka	^t#kamadhatu(欲界)、^t#rupadhatu(色界)、^t#arupadhatu(無色界)之合稱。
    kamadhatu	欲界是一切由各種欲望支配的生命形式的居所，由低到高分為：①地獄………
    rupadhatu	色界則在「六欲天」之上，有色眾生居處於其中………
    arupadhatu	無色界在色界之上，又分為：①空無邊（無色）天；

其中  triloka, kamadhatu, rupadhatu, arupadhatu 為新增詞條。

對佛學資料而言，詞條製作的主要成本在於確定漢詞和原文(梵或巴利)的一對一關係，因為一個梵文可能會譯是多個漢詞，而一個漢詞可能從不同梵詞而來。

    相：sañña (atta-sañña我相)  ，nimitta (kamma-nimitta 業相) , lakhana（三十二大人相mahāpurisa-lakhana）, 
    想：sañña (sañña-khaṇḍa 想蘊) ,   cinta(思考) , icchati (想要) , jhayati(冥想)
    行：saṅkhāra(五蘊之一), paṭipanna( dhamm-ānudhamma-ppaṭipanna ,法-隨法-行 ), cariya(梵行, brahama-cariya)
    心：hṛdaya (心臟) , citta (心識)。(  Prajñā-pāramitā-hṛdaya-sutra 般若-波羅蜜多-心經)
    質多：Citta (人名)
