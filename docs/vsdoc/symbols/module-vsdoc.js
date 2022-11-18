
/* vsdoc for module */

(function (window) {
    

    window.module = {
        /// <summary>The module.</summary>
        /// <returns type="module"/>
                
        exports: function(indir, outdir, transformFns, transformFns.onFile, transformFns.onDir, recurse, followLinks) {
            /// <summary>Copies a directory, running the file contents, file name, and directory names
            ///  through user specified transform functions.</summary>
            /// <param name="indir" type="String">The path to the input directory.</param>
            /// <param name="outdir" type="String">The path to the output directory.</param>
            /// <param name="transformFns" type="Object">An object whose
            ///  methods are the transformation functions.</param>
            /// <param name="transformFns.onFile" type="Function">A function
            ///  that receives the path to the input file and the output file. It
            ///  is the responsibility of this function to read the input file, perform the
            ///  desired transformation, and write that file to the specified output
            ///  location. The output directory will exist, so you don&apos;t have to check for
            ///  that.</param>
            /// <param name="transformFns.onDir" type="Function">A function
            ///  that takes the path to the next output directory which will be written and
            ///  performs a translation on it.</param>
            /// <param name="recurse" type="Boolean">Set this to true if you want to recurse into
            ///  subdirectories.</param>
            /// <param name="followLinks" type="Boolean">When set to true symlinks will be followed.
            ///  This determines whether fs.stat or fs.lstat is used in determining whether
            ///  an item in the directory is a file or directory.</param>
        }
        
    };

    var $x = window.module;
    $x.__namespace = "true";
    $x.__typeName = "module";
})(this);
