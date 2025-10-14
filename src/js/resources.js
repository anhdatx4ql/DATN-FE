let resources =  {
    vi: {
        noData: "Không có dữ liệu để hiển thị",
        noDataGrid: "Không có dữ liệu",
        errorMes: "Có lỗi xảy ra vui lòng liên hệ MISA!",
        companyName: {
            0: "CÔNG TY TNHH SẢN XUẤT - THƯƠNG MẠI - DỊCH VỤ - QUÝ PHÚC"
        },
        username: {
            0: "Phạm Văn Đạt"
        },
        menuItem:{
            0: "Tổng quan",
            1: "Tiền mặt",
            2: "Tiền gửi",
            4: "Bán hàng",
            5: "Quản lý đơn",
            7: "Tài sản cố định",
            10: "Thuế",
        },
        employeeDetail:{
            createTitle: "Thông tin nhân viên",
            updateTitle: "Sửa nhân viên",
            customer: "Là khách hàng",
            supplier: "Là nhà cung cấp",
            code: "Mã",
            fullName: "Tên",
            department: "Phòng ban",
            position: "Chức danh",
            dob: "Ngày sinh",
            gender: "Giới tính",
            identity: "Số CMND",
            identityDetail: "Số chứng minh nhân dân",
            dateOfIssue: "Ngày cấp",
            issuedBy: "Nơi cấp",
            address: "Địa chỉ",
            phoneNumber: "ĐT di động",
            phoneNumberDetail: "Điện thoại di động",
            landingPhone: "ĐT cố định",
            landingPhoneDetail: "Điện thoại cố định",
            bankAccount: "Số tài khoản ngân hàng",
            bankName: "Tên ngân hàng",
            bankBranch: "Chi nhánh tk ngân hàng",
            bankBranchDetail: "Chi nhánh tài khoản ngân hàng"
            
        },
        dialogMessage:{
            confirmDelete: "Bạn có muốn xóa nhân viên ",
            confirmDeleteAccount: "Bạn có thực sự muốn xóa Tài khoản ",
            confirmMultipleDelete: "Bạn có thực sự muốn xóa các nhân viên đã chọn không ?",
            confirmChange: "Dữ liệu đã thay đổi, bạn có muốn cất không ?",
            developing: "Tính năng đang được phát triển!"
        },
        btnAction:{
            cancel: "Hủy",
            cancelTooltip: "Hủy",
            store: "Cất",
            storeTooltip: "Cất (Ctrl + S)",
            storeSave: "Cất và thêm",
            storeSaveToolTip: "Cất và thêm (Ctrl + Shift + S)",
            confirm: "Đồng ý",
            yes: "Có",
            close: "Đóng",
            no: "Không",
            saveAndClose: "Cất và đóng",
            saveAndCloseTooltip: "Cất và đóng (Ctrl + Q)",
        },
        actionMultiple: {
            title: 'Thực hiện hàng loạt',
            deleteAction: 'Xóa',
            deleteMultipleConfirm: "Bạn có muốn xóa những chứng từ này không?"
        },
        contextMenuAction:{
            duplicate: "Nhân bản",
            delete: "Xóa",
            unuse: "Ngừng sử dụng"
        },
        employeeList: {
            title: "Nhân viên",
            createButton: "Thêm nhân viên",
            EmployeeCodeTitle: "Mã nhân viên",
            EmployeeFullNameTitle: "Tên nhân viên",
        },
        employeeDetailError:{
            duplicateCode: "Mã nhân viên đã tồn tại trong hệ thống",
            codeInvalidLength: "Mã nhân viên không được phép vượt quá 20 ký tự",
            nameInvalidLength: "Tên nhân viên không được phép vượt quá 100 ký tự",
            dobInvalidData: "Ngày sinh không hợp lệ",
            issueDateInvalid: "Ngày cấp không hợp lệ",
        },
        employeeDetailBtn:{
            save: "Cất",
            saveTooltip: "Cất (Ctrl + S)",
            saveAndAdd: "Cất và thêm",
            saveAndAddTooltip: "Cất và thêm (Ctrl + Shift + S)",
            close: "Hủy",
            closeTooltip: "Hủy (ESC)"
        },
        common:{
            developing: "Tính năng đang được phát triển"
        },
        cash:{
            progress:{
                title: "NGHIỆP VỤ TIỀN MẶT"
            },

            main:{
                content: ['Thu tiền', 'Chi tiền', 'Kiểm kê quỹ'],
                menu: ['Khách hàng', 'Nhà cung cấp', 'Nhân viên', 'Tài khoản']
            },

            report:{
                title: "BÁO CÁO",
                main: ['Danh sách tài sản', 'Báo cáo cấp phát tài sản', 'S03a1-DN: Sổ nhật ký thu tiền', 'Hóa đơn mua tài sản', 'Danh sách tài sản hư hỏng'],
                footer: "Tất cả báo cáo",
            }
        },
        di:{
            return: "Tất cả danh mục",
            title: ['Danh mục', 'Nhân viên', 'Khách hàng', 'Nhà cung cấp', 'Tài khoản'],
            areaTitle: {
                object: 'Đối tượng',
                expense: "Chi phí",
                commodity: 'Vật tư hàng hóa',
                account: 'Tài khoản',
                bank: 'Ngân hàng',
                assets: 'Tài sản',
                branch: 'Chi nhánh, phòng ban',
                tax: 'Thuế',
                other: 'Khác',
            },
            objectList: [
                {txt: "Khách hàng", router: "DICustomer" },
                {txt: "Nhà cung cấp", router: "DISupplier" },
                {txt: "Nhân viên", router: "DIEmployee" },
                {txt: "Nhóm khách hàng, nhà cung cấp", router: "DICustomerSupplier" },
            ],
            accountList: [
                {txt: 'Hệ thống tài khoản', router: 'DIAccountSystem'},
                {txt: 'Tài khoản kết chuyển', router: 'DIAccountTransfer'},
                {txt: 'Tài khoản ngầm định', router: 'DIAccountDefault'},
            ],
            commodityList: ['Vật tư hàng hóa', 'Kho', 'Nhóm vật tu, hàng hóa, dịch vụ', 'Đơn vị tính'],
            expenseList: ['Đối tượng tập hợp chi phí', 'Khoản mục chi phí', 'Công trình', 'Loại công trình'],
            bankList: ['Ngân hàng', 'Tài khoản ngân hàng'],
            branchList: ['Cơ cấu tổ chức'],
            assetsList: ['Loại công cụ dụng cụ', 'Loại tài sản cố định'],
            taxList: ['Biểu thuế tiêu thụ đặc biệt', 'Biểu thuế tài nguyên'],
            otherList: ['Điều khoản thanh toán', 'Mục thu/chi', 'Mã thống kế', 'Loại tiền', 'Loại chứng từ'],
        },

        paymentDetail:{
            payment_reason: [
                'Trả tiền cho nhà cung cấp (không theo hóa đơn)',
                'Tạm ứng cho nhân viên',
                'Chi mua ngoài có hóa đơn',
                'Trả lương nhân viên',
                'Chuyển tiền cho chi nhánh khác',
                'Gửi tiền vào ngân hàng',
                'Chi khác',
            ],

            paymentError: {
                debitRequired: 'Tài khoản nợ không được để trống',
                creditRequired: 'Tài khoản có không được để trống',
                reRefRequired: 'Số phiếu chi không được để trống',
            }
        },
        
        accountList:{
            title: "Hệ thống tài khoản",
            inputPlaceholder: "Tìm kiếm theo số, tên tài khoản",
            searchPlaceholder: "Nhập từ khóa tìm kiếm",
            data:{
                accountNumber: "Số tài khoản",
                accountName: "Tên tài khoản",
                property: "Tính chất",
                englishName: "Tên tiếng anh",
                description: "Diễn giải",
                status: "Trạng thái",
                dataLevel: "Mức độ phụ thuộc",
                createdDate: "Ngày tạo",
                createdBy: "Người tạo",
                modifiedDate: "Ngày sửa",
                modifiedBy: "Người sửa",
            },

            parentAcc: "Tài khoản tổng hợp",
            
            status: {
                using: "Đang sử dụng",
                unuse: "Ngừng sử dụng",
            },

            props: {
                Debt: 'Dư nợ',
                Excess: 'Dư có',
                Hermaphrodite: 'Lưỡng tính',
                NoBalance: 'Không có số dư',
            },

            deleteFail: "Bạn phải xóa các tài khoản con trước khi xóa tài khoản cha",

            foldAll: 'Thu gọn',

            expandAll: 'Mở rộng',

            updateStatusConfirm: 'Bạn có muốn thiết lập trạng thái "Sử dụng" cho tất cả Tài khoản con không',

            updateStatusFail: 'Tài khoản cha đang ở trạng thái "Ngừng sử dụng". Bạn không thể thiết lập trạng thái "Sử dụng" cho Tài khoản con',
        },

        accountDetail:{
            title:{
                create: "Thêm tài khoản",
                update: "Sửa tài khoản",
                duplicate: "Nhân bản tài khoản",
            },

            followTo: "Theo dõi chi tiết theo",

            checkboxTitle: {
                Accounting: "Có hoạch toán theo ngoại lệ",
                Object: "Đối tượng",
                ObjectTHCP: "Đối tượng THCP",
                Order: "Đơn đặt mua",
                PurchaseContract: "Hợp đồng mua",
                Unit: "Đơn vị",
                BankAccount: "Tài khoản ngân hàng",
                Construct: "Công trình",
                SellContract: "Hợp đồng bán",
                CPItem: "Khoản mục CP",
                StatisticalCode: "Mã thống kê"
            },

            comboboxData: {
                ObjectFollow: ['Khách hàng', 'Nhân viên', 'Nhà cung cấp'],
                AlertRequired: ['Chỉ cảnh báo', 'Bắt buộc nhập'],
            },

            property:[{props: 'Dư nợ'}, {props: 'Dư có'}, {props: 'Lưỡng tính'},{props: 'Không có số dư'}],
        },

        cashControl:{
            actionBtn: {
                PC: "Chi tiền",
                PT: "Thu tiền"
            },

            gridData:{
                rp_date: "Ngày hạch toán",
                ca_date: "Ngày chứng từ",
                rp_ref_no: "Số chứng từ",
                rp_description: "Diễn giải",
                amount: "Số tiền",
                object: "Đối tượng",
                object_code: "Mã đối tượng",
                rp_reason: "Lý do thu/chi",
                ca_type: "Loại chứng từ",
            },

            detail: "Chi tiết",

            gridMaster:{
                total_txt: "Tổng",
            },

            gridDetail:{
                title: 'Phiếu chi',
                rp_description: "Diễn giải",
                debit_account: "TK nợ",
                debit_account_tooltip: "Tài khoản nợ",
                credit_account: "TK có",
                credit_account_tooltip: "Tài khoản có",
                amount: "Số tiền",
                object: "Đối tượng",
                object_name: "Tên đối tượng",
                payment_date: 'Ngày phiếu chi',
                success_date: 'Ngày hạch toán',
            },

            objectCombobox:{
                object: 'Đối tượng',
                objectCode: 'Mã đối tượng',
                objectName: 'Tên đối tượng',
                tax_code: 'Mã số thuế',
                address: 'Địa chỉ',
                phone_number: 'Số điện thoại',
                receive: 'Người nhận',
                pay_reason: 'Lý do chi',
                employee: 'Nhân viên',
                more: 'Kèm theo',
                re_no: 'Số phiếu chi',
                summary: 'Tổng tiền',
            }
        },

        empty_audit_list: 'Thêm biên bản kiểm kê quỹ để ghi nhận kết quả kiểm kê quỹ tiền mặt thực tế và hạch toán xử lý chênh lệch từ việc kiểm kê',

        empty_monetary_flow: 'Dự báo dòng tiền thu vào, chi ra trong một kỳ nhất định để biết được khả năng thu, chi trong tương lai đảm bảo đủ vốn để thực hiện các hoạt động thường xuyên của đơn vị',
        
        ui_setting: 'Tùy chỉnh giao diện',

        ui_setting_button: {
            setDefault: 'Lấy mẫu ngầm định',
        },

        ui_setting_data:{
            colName: 'Tên cột dữ liệu',
        }
    },

    en: {
        errorMes: "Oops, something went wrong contact MISA!"
    },

    endpoint: "https://localhost:44381/api/"
}

export default resources